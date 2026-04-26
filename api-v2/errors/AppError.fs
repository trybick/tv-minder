module AppError

open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Logging
open Giraffe
open ValueObjects
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

type private ErrorEnvelope = { Error: ErrorBody }
and private ErrorBody = { Message: string }

let private describeValidation (err: ValidationError) =
    match err with
    | EmailRequired -> "Email is required"
    | EmailMalformed v -> sprintf "Email '%s' is malformed" v
    | PasswordTooShort n -> sprintf "Password must be at least %d characters" n

let private toStatusAndMessage (err: AppError) : int * string =
    match err with
    | Validation errs ->
        let detail = errs |> List.map describeValidation |> String.concat "; "
        422, detail
    | Domain EmailAlreadyInUse -> 409, "Email already registered"
    | Domain InvalidCredentials -> 401, "Invalid credentials"
    | Infrastructure DuplicateKey -> 409, "Email already registered"
    | Infrastructure _ -> 500, "An unexpected error occurred"

let private logInfrastructure (ctx: HttpContext) (err: InfrastructureError) =
    let logger = ctx.GetLogger "AppError"

    match err with
    | DatabaseError ex -> logger.LogError(ex, "Database error")
    | DuplicateKey -> ()
    | TokenGenerationFailed ex -> logger.LogError(ex, "Token generation failed")
    | Unexpected message -> logger.LogError("Unexpected error: {Message}", message)

let toHttp (err: AppError) : HttpHandler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            match err with
            | Infrastructure infra -> logInfrastructure ctx infra
            | _ -> ()

            let status, message = toStatusAndMessage err
            ctx.SetStatusCode status
            return! json { Error = { Message = message } } next ctx
        }
