module MyApp.Router

open Giraffe.EndpointRouting

let webApp: Endpoint list =
    [ yield! HealthCheckRoutes.routes
      yield! PersonRoutes.routes
      yield! AuthRoutes.routes ]
