module AuthRoutes

open Giraffe.EndpointRouting

let routes: Endpoint list =
    [ POST
          [ route "/signup" AuthHandler.signup
            route "/login" AuthHandler.login ] ]
