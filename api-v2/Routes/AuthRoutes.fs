module AuthRoutes

open Giraffe


let authRoutes: HttpHandler = choose [ route "/signup" >=> text "ok"; route "/login" >=> text "ok" ]
