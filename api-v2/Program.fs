open DotNetEnv
open Microsoft.AspNetCore.Builder
open Giraffe
open Giraffe.EndpointRouting

[<EntryPoint>]
let main args =
    Env.Load() |> ignore

    let builder = WebApplication.CreateBuilder(args)
    builder.Services.AddGiraffe() |> ignore
    let app = builder.Build()

    app.UseRouting() |> ignore
    app.UseEndpoints(fun e -> e.MapGiraffeEndpoints Router.webApp) |> ignore

    app.Run()
    0
