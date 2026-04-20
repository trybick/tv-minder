module UserRepository

open System
open Dapper
open Npgsql

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
        "SELECT id, email, password_hash as PasswordHash
        FROM users
        WHERE email = @Email",
        {| Email = email |}
    )
    |> Option.ofObj
    |> Option.map toUser

let create (id: Guid) (email: string) (passwordHash: byte[]) =
    use conn = Database.createConnection ()

    conn.Execute(
        "INSERT INTO users (id, email, password_hash)
         VALUES (@Id, @Email, @PasswordHash)",
        {| Id = id
           Email = email
           PasswordHash = passwordHash |}
    )
    |> ignore
