module User

open Primitives

type User =
    {
        Id: UserId
        Email: Email
        PasswordHash: PasswordHash
        TrackedShowIds: ShowId list
    }

type UserError =
    | EmailAlreadyInUse
    | InvalidCredentials

type Command =
    | Signup of email: Email * password: RawPassword
    | Login of email: Email * password: RawPassword

type Event =
    | UserSignedUp of
        id: UserId *
        email: Email *
        passwordHash: PasswordHash *
        trackedShowIds: ShowId list
    | LoginSucceeded of id: UserId * email: Email

type PasswordHasher =
    {
        Hash: RawPassword -> PasswordHash
        Verify: RawPassword -> PasswordHash -> bool
    }

let handle
    (hasher: PasswordHasher)
    (command: Command)
    (existingUser: User option)
    : Result<Event, UserError> =
    match command with
    | Signup(email, password) ->
        match existingUser with
        | Some _ -> Error EmailAlreadyInUse
        | None -> Ok(UserSignedUp(UserId.newId (), email, hasher.Hash password, []))
    | Login(_, password) ->
        match existingUser with
        | None -> Error InvalidCredentials
        | Some user ->
            if hasher.Verify password user.PasswordHash then
                Ok(LoginSucceeded(user.Id, user.Email))
            else
                Error InvalidCredentials
