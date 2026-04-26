module AuthRoutes

open Giraffe.EndpointRouting

let routes: Endpoint list =
    [
        POST [
            route "/register" AuthHandler.register
            route "/login" AuthHandler.login
        ]
    ]
