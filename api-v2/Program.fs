open DotNetEnv
open Microsoft.AspNetCore.Builder
open Giraffe
open Giraffe.EndpointRouting

let DEFAULT_PORT = "4600"

let startApi (args: string array) =
    Database.runMigrations ()

    let port =
        System.Environment.GetEnvironmentVariable "PORT"
        |> Option.ofObj
        |> Option.defaultValue DEFAULT_PORT


    let builder = WebApplication.CreateBuilder args
    builder.Services.AddGiraffe() |> ignore

    let app = builder.Build()
    app.Urls.Add $"http://0.0.0.0:{port}"

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
