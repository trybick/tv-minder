module TrackedShowsRoutes

open Giraffe
open Giraffe.EndpointRouting

let private authenticated = requiresAuthentication (challenge "Bearer")

let routes: Endpoint list =
    [
        GET [ route "/track" (authenticated >=> TrackedShowsHandler.getTrackedShows) ]
        POST [ routef "/track/%i" (fun showId -> authenticated >=> TrackedShowsHandler.trackShow showId) ]
        DELETE [ routef "/track/%i" (fun showId -> authenticated >=> TrackedShowsHandler.untrackShow showId) ]
    ]
