module MyApp.PersonHandler

open Microsoft.AspNetCore.Http
open Giraffe

let getPeople : HttpHandler =
    fun next ctx -> json [| "Alice"; "Bob" |] next ctx

let getPerson (id: int) : HttpHandler =
    fun next ctx -> json {| id = id; name = "Alice" |} next ctx

let createPerson : HttpHandler =
    fun next ctx ->
        task {
            let! body = ctx.ReadBodyFromRequestAsync()
            return! json {| created = true |} next ctx
        }
