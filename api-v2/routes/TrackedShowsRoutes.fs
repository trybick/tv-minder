module TrackedShowsRoutes

open Giraffe
open Giraffe.EndpointRouting

let routes: Endpoint list =
    [
        GET [ route "/tracked-shows" (requiresAuthentication (challenge "Bearer") >=> TrackedShowsHandler.getTrackedShows) ]
        POST [ route "/tracked-shows" (requiresAuthentication (challenge "Bearer") >=> TrackedShowsHandler.updateTrackedShows) ]
    ]
