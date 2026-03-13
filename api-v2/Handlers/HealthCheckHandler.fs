module MyApp.HealthCheckHandler

open Microsoft.AspNetCore.Http
open Giraffe

let healthCheckHandler : HttpHandler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        json {| status = "ok" |} next ctx
