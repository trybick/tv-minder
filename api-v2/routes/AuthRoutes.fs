module AuthRoutes

open Giraffe.EndpointRouting

let routes: Endpoint list =
    [ POST
          [ route "/auth/signup" AuthHandler.signup
            route "/auth/login" AuthHandler.login ] ]
