open Microsoft.AspNetCore.Builder
open Giraffe
open Giraffe.EndpointRouting
open MyApp

[<EntryPoint>]
let main args =
    let builder = WebApplication.CreateBuilder(args)

    builder.Services.AddGiraffe() |> ignore

    let app = builder.Build()

    app.UseRouting() |> ignore

    app.UseEndpoints(fun e -> e.MapGiraffeEndpoints(Router.webApp)) |> ignore

    app.Run()
    0
