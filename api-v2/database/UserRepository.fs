module UserRepository

open System
open Npgsql
open Dapper

type UserRow =
    { Id: Guid
      Email: string
      PasswordHash: byte[] }

let private toUser (row: UserRow) : User.User =
    { Id = row.Id
      Email = row.Email
      PasswordHash = row.PasswordHash }

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
