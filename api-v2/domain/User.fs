module User

open ValueObjects

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

type PasswordHasher =
    {
        Hash: RawPassword -> PasswordHash
        Verify: RawPassword -> PasswordHash -> bool
    }

let signup
    (hasher: PasswordHasher)
    (email: Email)
    (password: RawPassword)
    (existingUser: User option)
    : Result<User, UserError> =
    match existingUser with
    | Some _ -> Error EmailAlreadyInUse
    | None ->
        Ok
            {
                Id = UserId.newId ()
                Email = email
                PasswordHash = hasher.Hash password
                TrackedShowIds = []
            }

let login
    (hasher: PasswordHasher)
    (password: RawPassword)
    (existingUser: User option)
    : Result<User, UserError> =
    match existingUser with
    | None -> Error InvalidCredentials
    | Some user ->
        if hasher.Verify password user.PasswordHash then
            Ok user
        else
            Error InvalidCredentials
