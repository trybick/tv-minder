module HealthCheckRoutes

open Giraffe


let healthCheckRoutes: HttpHandler = choose [ route "/health" >=> text "ok" ]
