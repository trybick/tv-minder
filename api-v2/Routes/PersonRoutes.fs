module MyApp.PersonRoutes

open Giraffe.EndpointRouting

let routes : Endpoint list = [
    GET [
        route  "/api/persons"    PersonHandler.getPeople
        routef "/api/persons/%i" PersonHandler.getPerson
    ]
    POST [
        route "/api/persons" PersonHandler.createPerson
    ]
]
