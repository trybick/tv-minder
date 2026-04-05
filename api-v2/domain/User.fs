module User

open System
open System.Text
open Konscious.Security.Cryptography
open System.Security.Cryptography

// --- Types ---

type User =
    { Id: Guid
      Email: string
      PasswordHash: byte[] }

type Command =
    | Signup of email: string * password: string
    | Login of email: string * password: string

type Event =
    | UserSignedUp of id: Guid * email: string * passwordHash: byte[]
    | LoginSucceeded of id: Guid * email: string

// --- Password hashing ---

let private hashPassword (password: string) =
    use argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
    argon2.Iterations <- 4
    argon2.MemorySize <- 65536
    argon2.DegreeOfParallelism <- 2
    argon2.GetBytes 32

let private verifyPassword (password: string) (hash: byte[]) =
    let computed = hashPassword password

    CryptographicOperations.FixedTimeEquals(ReadOnlySpan(computed), ReadOnlySpan(hash))

// --- Aggregate ---

let handle (command: Command) (existingUser: User option) : Result<Event, string> =
    match command with
    | Signup(email, password) ->
        match existingUser with
        | Some _ -> Error "Email already in use"
        | None ->
            let hash = hashPassword password
            Ok(UserSignedUp(Guid.NewGuid(), email, hash))
    | Login(_, password) ->
        match existingUser with
        | None -> Error "Invalid email or password"
        | Some user ->
            if verifyPassword password user.PasswordHash then
                Ok(LoginSucceeded(user.Id, user.Email))
            else
                Error "Invalid email or password"
