module User

open System
open System.Text
open Konscious.Security.Cryptography

type User =
    { Id: Guid
      Email: string
      PasswordHash: string }

type Command =
    | Signup of email: string * password: string
    | Login of email: string * password: string

type Event =
    | UserSignedUp of id: Guid * email: string * passwordHash: byte[]
    | LoginSucceeded of id: Guid * email: string
