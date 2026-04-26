module TrackedShowsHandler

open System
open System.Security.Claims
open Giraffe
open Microsoft.AspNetCore.Http
open FsToolkit.ErrorHandling
open ValueObjects
open AppError

let private getUserId (ctx: HttpContext) : Result<UserId, AppError> =
    let claim = ctx.User.FindFirst(ClaimTypes.NameIdentifier)

    if isNull claim then
        Error(Infrastructure(Unexpected "Invalid or missing user identity"))
    else
        match Guid.TryParse claim.Value with
        | true, guid -> Ok(UserId.fromTrusted guid)
        | _ -> Error(Infrastructure(Unexpected "Invalid or missing user identity"))

let private noContent (next: HttpFunc) (ctx: HttpContext) =
    ctx.SetStatusCode 204
    next ctx

let private respondNoContent (next: HttpFunc) (ctx: HttpContext) (result: Result<unit, AppError>) =
    match result with
    | Ok () -> noContent next ctx
    | Error err -> toHttp err next ctx

let getTrackedShows (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! result =
            taskResult {
                let! userId = getUserId ctx

                let! shows =
                    UserRepository.getTrackedShows userId |> TaskResult.mapError Infrastructure

                return shows |> List.map ShowId.value
            }

        return!
            match result with
            | Ok body -> json {| data = body |} next ctx
            | Error err -> toHttp err next ctx
    }

let trackShow (showId: int) : HttpHandler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let! result =
                taskResult {
                    let! userId = getUserId ctx

                    do!
                        UserRepository.addTrackedShow userId (ShowId.fromTrusted showId)
                        |> TaskResult.mapError Infrastructure

                    return ()
                }

            return! respondNoContent next ctx result
        }

let untrackShow (showId: int) : HttpHandler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let! result =
                taskResult {
                    let! userId = getUserId ctx

                    do!
                        UserRepository.removeTrackedShow userId (ShowId.fromTrusted showId)
                        |> TaskResult.mapError Infrastructure

                    return ()
                }

            return! respondNoContent next ctx result
        }
