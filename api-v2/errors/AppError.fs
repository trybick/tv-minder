module AppError

open System.Text
open System.Text.Json
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Logging
open Giraffe
open Primitives
open User

type InfrastructureError =
    | DatabaseError of ex: exn
    | DuplicateKey
    | TokenGenerationFailed of ex: exn
    | Unexpected of message: string

type AppError =
    | Validation of ValidationError list
    | Domain of UserError
    | Infrastructure of InfrastructureError

type ProblemDetails =
    {
        Type: string
        Title: string
        Status: int
        Detail: string
        Code: string
    }

let private problem title status detail code =
    {
        Type = "about:blank"
        Title = title
        Status = status
        Detail = detail
        Code = code
    }

let private describeValidation (err: ValidationError) =
    match err with
    | EmailRequired -> "Email is required"
    | EmailMalformed v -> sprintf "Email '%s' is malformed" v
    | PasswordTooShort n -> sprintf "Password must be at least %d characters" n

let private toProblem (err: AppError) : ProblemDetails =
    match err with
    | Validation errs ->
        let detail = errs |> List.map describeValidation |> String.concat "; "

        problem "Validation failed" 400 detail "validation.failed"
    | Domain EmailAlreadyInUse ->
        problem "Conflict" 409 "Email already in use" "user.email_already_in_use"
    | Domain InvalidCredentials ->
        problem "Unauthorized" 401 "Invalid email or password" "user.invalid_credentials"
    | Infrastructure DuplicateKey ->
        problem "Conflict" 409 "Email already in use" "user.email_already_in_use"
    | Infrastructure _ ->
        problem "Internal server error" 500 "An unexpected error occurred" "internal.error"

let private logInfrastructure (ctx: HttpContext) (err: InfrastructureError) =
    let logger = ctx.GetLogger "AppError"

    match err with
    | DatabaseError ex -> logger.LogError(ex, "Database error")
    | DuplicateKey -> ()
    | TokenGenerationFailed ex -> logger.LogError(ex, "Token generation failed")
    | Unexpected message -> logger.LogError("Unexpected error: {Message}", message)

let toHttp (err: AppError) : HttpHandler =
    fun (_next: HttpFunc) (ctx: HttpContext) ->
        task {
            match err with
            | Infrastructure infra -> logInfrastructure ctx infra
            | _ -> ()

            let details = toProblem err
            ctx.Response.StatusCode <- details.Status
            ctx.Response.ContentType <- "application/problem+json"

            let options = JsonSerializerOptions(PropertyNamingPolicy = JsonNamingPolicy.CamelCase)
            let payload = JsonSerializer.Serialize(details, options)
            let bytes = Encoding.UTF8.GetBytes payload
            do! ctx.Response.Body.WriteAsync(bytes, 0, bytes.Length)
            return Some ctx
        }
