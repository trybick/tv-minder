module Router

open Giraffe.EndpointRouting

let webApp: Endpoint list =
    [
        subRoute "/api" [ yield! HealthCheckRoutes.routes; yield! AuthRoutes.routes ]
    ]
