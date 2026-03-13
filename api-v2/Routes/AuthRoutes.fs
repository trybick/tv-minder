module MyApp.AuthRoutes

open Giraffe.EndpointRouting

let routes: Endpoint list =
    [ GET
          [ route "/auth/signup" AuthHandler.signup
            route "/auth/login" AuthHandler.login ] ]
