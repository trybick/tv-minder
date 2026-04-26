module HealthCheckHandler

open Microsoft.AspNetCore.Http
open Giraffe

let healthCheckHandler: HttpHandler =
    fun (next: HttpFunc) (ctx: HttpContext) -> json {| data = {| status = "ok" |} |} next ctx
