open System.Text
open DotNetEnv
open Microsoft.AspNetCore.Authentication.JwtBearer
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Logging
open Microsoft.IdentityModel.Tokens
open Giraffe
open Giraffe.EndpointRouting

let DEFAULT_PORT = "4600"

let errorHandler (ex: exn) (logger: ILogger) : HttpHandler =
    logger.LogError(ex, "Unhandled exception")
    clearResponse >=> AppError.toHttp (AppError.Infrastructure (AppError.Unexpected ex.Message))

let startApi (args: string array) =
    Database.runMigrations ()

    let port = Env.tryAndDefault "PORT" DEFAULT_PORT
    let jwtSecret = Env.require "JWT_SECRET"

    let builder = WebApplication.CreateBuilder args
    builder.Services.AddGiraffe() |> ignore

    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(fun options ->
            options.TokenValidationParameters <-
                TokenValidationParameters(
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = SymmetricSecurityKey(Encoding.UTF8.GetBytes jwtSecret),
                    ValidateIssuer = false,
                    ValidateAudience = false
                ))
    |> ignore

    builder.Services.AddAuthorization() |> ignore

    let app = builder.Build()
    app.Urls.Add $"http://0.0.0.0:{port}"

    app.UseGiraffeErrorHandler(errorHandler) |> ignore
    app.UseAuthentication() |> ignore
    app.UseAuthorization() |> ignore
    app.UseRouting() |> ignore
    app.UseEndpoints(fun e -> e.MapGiraffeEndpoints Router.webApp) |> ignore

    app.Run()
    0

[<EntryPoint>]
let main args =
    Env.Load() |> ignore

    match Array.tryItem 0 args with
    | Some "seed" ->
        Database.runSeed ()
        0
    | _ -> startApi args
