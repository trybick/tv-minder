module MyApp.HealthCheckRoutes

open Giraffe.EndpointRouting

let routes: Endpoint list =
    [ GET [ route "/health" HealthCheckHandler.healthCheckHandler ] ]
