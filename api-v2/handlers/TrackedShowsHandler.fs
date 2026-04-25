module TrackedShowsHandler

open System
open System.Security.Claims
open Giraffe
open Microsoft.AspNetCore.Http
open FsToolkit.ErrorHandling
open ValueObjects
open AppError

type TrackedShowsResponse = { TrackedShows: int list }
type UpdateTrackedShowsRequest = { TrackedShows: int list }

let private getUserId (ctx: HttpContext) : Result<UserId, AppError> =
    let claim = ctx.User.FindFirst(ClaimTypes.NameIdentifier)

    if isNull claim then
        Error(Infrastructure(Unexpected "Invalid or missing user identity"))
    else
        match Guid.TryParse claim.Value with
        | true, guid -> Ok(UserId.fromTrusted guid)
        | _ -> Error(Infrastructure(Unexpected "Invalid or missing user identity"))

let getTrackedShows (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! result =
            taskResult {
                let! userId = getUserId ctx

                let! shows =
                    UserRepository.getTrackedShows userId |> TaskResult.mapError Infrastructure

                return { TrackedShows = shows |> List.map ShowId.value }
            }

        return!
            match result with
            | Ok body -> json body next ctx
            | Error err -> toHttp err next ctx
    }

let updateTrackedShows (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! result =
            taskResult {
                let! userId = getUserId ctx
                let! body = ctx.BindJsonAsync<UpdateTrackedShowsRequest>() |> Task.map Ok

                let showIds = body.TrackedShows |> List.map ShowId.fromTrusted

                do!
                    UserRepository.updateTrackedShows userId showIds
                    |> TaskResult.mapError Infrastructure

                return { TrackedShows = body.TrackedShows }
            }

        return!
            match result with
            | Ok body -> json body next ctx
            | Error err -> toHttp err next ctx
    }
