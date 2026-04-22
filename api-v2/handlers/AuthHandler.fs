module AuthHandler

open System
open System.Text
open Giraffe
open Microsoft.AspNetCore.Http
open Microsoft.IdentityModel.Tokens
open System.IdentityModel.Tokens.Jwt
open System.Security.Claims
open FsToolkit.ErrorHandling
open Primitives
open AppError

type SignupRequest = { Email: string; Password: string }
type LoginRequest = { Email: string; Password: string }
type AuthResponse = { Token: string }

let private generateToken (userId: UserId) (email: string) : Result<string, InfrastructureError> =
    try
        let secret = Env.require "JWT_SECRET"
        let key = SymmetricSecurityKey(Encoding.UTF8.GetBytes secret)
        let creds = SigningCredentials(key, SecurityAlgorithms.HmacSha256)

        let claims =
            [|
                Claim(ClaimTypes.NameIdentifier, UserId.value userId |> string)
                Claim(ClaimTypes.Email, email)
            |]

        let token =
            JwtSecurityToken(
                claims = claims,
                expires = DateTime.UtcNow.AddDays 365,
                signingCredentials = creds
            )

        Ok(JwtSecurityTokenHandler().WriteToken token)
    with ex ->
        Error(TokenGenerationFailed ex)

let private parseSignupCredentials (rawEmail: string) (rawPassword: string) =
    validation {
        let! email = Email.create rawEmail
        and! password = Password.validate rawPassword
        return email, password
    }
    |> Result.mapError Validation

let private parseLoginEmail (rawEmail: string) : Result<Email, AppError> =
    Email.create rawEmail
    |> Result.mapError (fun _ -> Domain User.InvalidCredentials)

let private respond (next: HttpFunc) (ctx: HttpContext) (result: Result<AuthResponse, AppError>) =
    match result with
    | Ok body -> json body next ctx
    | Error err -> toHttp err next ctx

let signup (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! body = ctx.BindJsonAsync<SignupRequest>()

        let! result =
            taskResult {
                let! email, password = parseSignupCredentials body.Email body.Password

                let! existing =
                    UserRepository.getByEmail email |> TaskResult.mapError Infrastructure

                let! event =
                    User.handle PasswordHashing.argon2Hasher (User.Signup(email, password)) existing
                    |> Result.mapError Domain

                match event with
                | User.UserSignedUp(id, userEmail, hash, trackedShowIds) ->
                    do!
                        UserRepository.create id userEmail hash trackedShowIds
                        |> TaskResult.mapError (function
                            | DuplicateKey -> Domain User.EmailAlreadyInUse
                            | infra -> Infrastructure infra)

                    let! token =
                        generateToken id (Email.value userEmail) |> Result.mapError Infrastructure

                    return { Token = token }
                | _ -> return! Error(Infrastructure(Unexpected "Expected UserSignedUp event"))
            }

        return! respond next ctx result
    }

let login (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! body = ctx.BindJsonAsync<LoginRequest>()

        let! result =
            taskResult {
                let! email = parseLoginEmail body.Email

                let! existing =
                    UserRepository.getByEmail email |> TaskResult.mapError Infrastructure

                let! event =
                    User.handle
                        PasswordHashing.argon2Hasher
                        (User.Login(email, RawPassword.fromInput body.Password))
                        existing
                    |> Result.mapError Domain

                match event with
                | User.LoginSucceeded(id, userEmail) ->
                    let! token =
                        generateToken id (Email.value userEmail) |> Result.mapError Infrastructure

                    return { Token = token }
                | _ -> return! Error(Infrastructure(Unexpected "Expected LoginSucceeded event"))
            }

        return! respond next ctx result
    }
