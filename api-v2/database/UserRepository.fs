module UserRepository

open System
open System.Threading.Tasks
open Dapper
open Npgsql
open ValueObjects
open AppError

type UserRow =
    {
        Id: Guid
        Email: string
        PasswordHash: byte[]
        TrackedShows: int[]
    }

let private toUser (row: UserRow) : User.User =
    {
        Id = UserId.fromTrusted row.Id
        Email = Email.fromTrusted row.Email
        PasswordHash = PasswordHash.create row.PasswordHash
        TrackedShows = row.TrackedShows |> Array.toList |> List.map ShowId.fromTrusted
    }

let getByEmail (email: Email) : Task<Result<User.User option, InfrastructureError>> =
    task {
        try
            use conn = Database.createConnection ()

            let! row =
                conn.QuerySingleOrDefaultAsync<UserRow>(
                    "SELECT id, email, password_hash as PasswordHash, tracked_show_ids as TrackedShowIds
                     FROM users
                     WHERE email = @Email",
                    {| Email = Email.value email |}
                )

            return row |> Option.ofObj |> Option.map toUser |> Ok
        with ex ->
            return Error(DatabaseError ex)
    }

let create
    (id: UserId)
    (email: Email)
    (passwordHash: PasswordHash)
    (trackedShows: ShowId list)
    : Task<Result<unit, InfrastructureError>> =
    task {
        try
            use conn = Database.createConnection ()

            let! _ =
                conn.ExecuteAsync(
                    "INSERT INTO users (id, email, password_hash, tracked_show_ids)
                     VALUES (@Id, @Email, @PasswordHash, @TrackedShows)",
                    {|
                        Id = UserId.value id
                        Email = Email.value email
                        PasswordHash = PasswordHash.value passwordHash
                        TrackedShows = trackedShows |> List.map ShowId.value |> List.toArray
                    |}
                )

            return Ok()
        with
        | :? PostgresException as pgEx when pgEx.SqlState = PostgresErrorCodes.UniqueViolation ->
            return Error DuplicateKey
        | ex -> return Error(DatabaseError ex)
    }

let getTrackedShows (userId: UserId) : Task<Result<ShowId list, InfrastructureError>> =
    task {
        try
            use conn = Database.createConnection ()

            let! result =
                conn.QuerySingleOrDefaultAsync<UserRow>(
                    "SELECT id, email, password_hash as PasswordHash, tracked_show_ids as TrackedShows
                     FROM users
                     WHERE id = @Id",
                    {| Id = UserId.value userId |}
                )

            let shows =
                result
                |> Option.ofObj
                |> Option.map (fun row -> row.TrackedShows |> Array.toList |> List.map ShowId.fromTrusted)
                |> Option.defaultValue []

            return Ok shows
        with ex ->
            return Error(DatabaseError ex)
    }

let updateTrackedShows (userId: UserId) (trackedShows: ShowId list) : Task<Result<unit, InfrastructureError>> =
    task {
        try
            use conn = Database.createConnection ()

            let! _ =
                conn.ExecuteAsync(
                    "UPDATE users SET tracked_show_ids = @TrackedShows WHERE id = @Id",
                    {|
                        Id = UserId.value userId
                        TrackedShows = trackedShows |> List.map ShowId.value |> List.toArray
                    |}
                )

            return Ok()
        with ex ->
            return Error(DatabaseError ex)
    }
