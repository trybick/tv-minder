module Router

open Giraffe.EndpointRouting

let webApp: Endpoint list =
    [ yield! HealthCheckRoutes.routes; yield! AuthRoutes.routes ]
