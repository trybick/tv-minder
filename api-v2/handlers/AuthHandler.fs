module AuthHandler

open System
open System.Text
open Giraffe
open Microsoft.AspNetCore.Http
open Microsoft.IdentityModel.Tokens
open System.IdentityModel.Tokens.Jwt
open System.Security.Claims
open FsToolkit.ErrorHandling
open ValueObjects
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

                let! newUser =
                    User.signup PasswordHashing.argon2Hasher email password existing
                    |> Result.mapError Domain

                do!
                    UserRepository.create newUser.Id newUser.Email newUser.PasswordHash newUser.TrackedShows
                    |> TaskResult.mapError (function
                        | DuplicateKey -> Domain User.EmailAlreadyInUse
                        | infra -> Infrastructure infra)

                let! token =
                    generateToken newUser.Id (Email.value newUser.Email) |> Result.mapError Infrastructure

                return { Token = token }
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

                let! user =
                    User.login PasswordHashing.argon2Hasher (RawPassword.fromInput body.Password) existing
                    |> Result.mapError Domain

                let! token =
                    generateToken user.Id (Email.value user.Email) |> Result.mapError Infrastructure

                return { Token = token }
            }

        return! respond next ctx result
    }
