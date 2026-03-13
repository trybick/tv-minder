open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.DependencyInjection
open Giraffe

open HealthCheckRoutes
open AuthRoutes

let webApp: HttpHandler =
    choose [
        healthCheckRoutes
        subRoute "/auth" authRoutes
    ]

let configureApp (app: IApplicationBuilder) = app.UseGiraffe webApp
let configureServices (services: IServiceCollection) = services.AddGiraffe() |> ignore

[<EntryPoint>]
let main _ =
    Host
        .CreateDefaultBuilder()
        .ConfigureWebHostDefaults(fun webHostBuilder ->
            webHostBuilder.Configure(configureApp).ConfigureServices configureServices
            |> ignore)
        .Build()
        .Run()

    0
