module UserRepository

open System
open Dapper

type UserRow =
    { Id: Guid
      Email: string
      PasswordHash: byte[]
      TrackedShowIds: int[] }

let private toUser (row: UserRow) : User.User =
    { Id = row.Id
      Email = row.Email
      PasswordHash = row.PasswordHash
      TrackedShowIds = row.TrackedShowIds |> Array.toList }

let getByEmail (email: string) =
    use conn = Database.createConnection ()

    conn.QuerySingleOrDefault<UserRow>(
        "SELECT id, email, password_hash as PasswordHash, tracked_show_ids as TrackedShowIds
        FROM users
        WHERE email = @Email",
        {| Email = email |}
    )
    |> Option.ofObj
    |> Option.map toUser

let create (id: Guid) (email: string) (passwordHash: byte[]) (trackedShowIds: int list) =
    use conn = Database.createConnection ()

    conn.Execute(
        "INSERT INTO users (id, email, password_hash, tracked_show_ids)
         VALUES (@Id, @Email, @PasswordHash, @TrackedShowIds)",
        {| Id = id
           Email = email
           PasswordHash = passwordHash
           TrackedShowIds = trackedShowIds |> List.toArray |}
    )
    |> ignore
