module Routes

open Giraffe


let routes: HttpHandler = choose [ route "/user1" >=> htmlString "<h1>Hello</h1>" ]
