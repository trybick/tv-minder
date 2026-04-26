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

type RegisterRequest =
    {
        Email: string
        Password: string
        IsGoogleUser: Nullable<bool>
        UnregisteredTrackedShows: int list option
    }

type LoginRequest =
    {
        Email: string
        Password: string
        IsGoogleUser: Nullable<bool>
    }

type LoginResponseData =
    {
        Token: string
        Email: string
        IsGoogleUser: bool
    }

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

let private parseRegisterCredentials (rawEmail: string) (rawPassword: string) =
    validation {
        let! email = Email.create rawEmail
        and! password = Password.validate rawPassword
        return email, password
    }
    |> Result.mapError Validation

let private parseLoginEmail (rawEmail: string) : Result<Email, AppError> =
    Email.create rawEmail
    |> Result.mapError (fun _ -> Domain User.InvalidCredentials)

let private noContent (next: HttpFunc) (ctx: HttpContext) =
    ctx.SetStatusCode 204
    next ctx

let private respondNoContent (next: HttpFunc) (ctx: HttpContext) (result: Result<unit, AppError>) =
    match result with
    | Ok () -> noContent next ctx
    | Error err -> toHttp err next ctx

let private respondWithData
    (next: HttpFunc)
    (ctx: HttpContext)
    (result: Result<LoginResponseData, AppError>)
    =
    match result with
    | Ok body -> json {| data = body |} next ctx
    | Error err -> toHttp err next ctx

let register (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! body = ctx.BindJsonAsync<RegisterRequest>()

        let! result =
            taskResult {
                let! email, password = parseRegisterCredentials body.Email body.Password

                let! existing =
                    UserRepository.getByEmail email |> TaskResult.mapError Infrastructure

                let! newUser =
                    User.signup PasswordHashing.argon2Hasher email password existing
                    |> Result.mapError Domain

                let initialShows =
                    body.UnregisteredTrackedShows
                    |> Option.defaultValue []
                    |> List.map ShowId.fromTrusted

                do!
                    UserRepository.create newUser.Id newUser.Email newUser.PasswordHash initialShows
                    |> TaskResult.mapError (function
                        | DuplicateKey -> Domain User.EmailAlreadyInUse
                        | infra -> Infrastructure infra)

                return ()
            }

        return! respondNoContent next ctx result
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

                let isGoogleUser =
                    if body.IsGoogleUser.HasValue then body.IsGoogleUser.Value else false

                return
                    {
                        Token = token
                        Email = Email.value user.Email
                        IsGoogleUser = isGoogleUser
                    }
            }

        return! respondWithData next ctx result
    }
