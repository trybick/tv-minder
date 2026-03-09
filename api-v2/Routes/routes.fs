module Routes

open Giraffe


let routes: HttpHandler = choose [ route "/health" >=> json "ok" ]
