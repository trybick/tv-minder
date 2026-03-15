open DotNetEnv
open Microsoft.AspNetCore.Builder
open Giraffe
open Giraffe.EndpointRouting

let PORT = "4600"

[<EntryPoint>]
let main args =
    Env.Load() |> ignore

    Database.runMigrations ()

    let port =
        System.Environment.GetEnvironmentVariable "PORT"
        |> Option.ofObj
        |> Option.defaultValue PORT


    if args.Length > 0 && args.[0] = "seed" then
        Database.runSeed ()
        0
    else
        let builder = WebApplication.CreateBuilder args
        builder.Services.AddGiraffe() |> ignore
        let app = builder.Build()
        app.Urls.Add $"http://0.0.0.0:{port}"

        app.UseRouting() |> ignore
        app.UseEndpoints(fun e -> e.MapGiraffeEndpoints Router.webApp) |> ignore

        app.Run()
        0
