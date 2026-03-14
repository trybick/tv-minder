module AuthHandler

open Giraffe

let signup: HttpHandler = fun next ctx -> text "ok" next ctx

let login: HttpHandler = fun next ctx -> text "ok" next ctx
