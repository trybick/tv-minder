module Primitives

open System
open System.Text.RegularExpressions

type UserId = private UserId of Guid

module UserId =
    let newId () : UserId = UserId(Guid.NewGuid())
    let value (UserId id) : Guid = id
    let fromTrusted (value: Guid) : UserId = UserId value

type ShowId = private ShowId of int

module ShowId =
    let value (ShowId id) : int = id
    let fromTrusted (value: int) : ShowId = ShowId value

type ValidationError =
    | EmailRequired
    | EmailMalformed of value: string
    | PasswordTooShort of minLength: int

type Email = private Email of string

module Email =
    let private regex = Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled)

    let create (value: string) : Result<Email, ValidationError> =
        if String.IsNullOrWhiteSpace value then
            Error EmailRequired
        else
            let normalized = value.Trim().ToLowerInvariant()

            if regex.IsMatch normalized then
                Ok(Email normalized)
            else
                Error(EmailMalformed value)

    let value (Email e) = e

    let fromTrusted (value: string) : Email = Email value

type RawPassword =
    private
    | RawPassword of string

    override _.ToString() = "***"

module RawPassword =
    let fromInput (value: string) : RawPassword = RawPassword value
    let value (RawPassword p) : string = p

module Password =
    [<Literal>]
    let MinLength = 8

    let validate (value: string) : Result<RawPassword, ValidationError> =
        if isNull value || value.Length < MinLength then
            Error(PasswordTooShort MinLength)
        else
            Ok(RawPassword value)

type PasswordHash = private PasswordHash of byte[]

module PasswordHash =
    let create (bytes: byte[]) : PasswordHash = PasswordHash bytes
    let value (PasswordHash bytes) : byte[] = bytes
