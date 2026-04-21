module Env

let require (key: string) =
    match System.Environment.GetEnvironmentVariable key with
    | null
    | "" -> failwithf "Required environment variable '%s' is not set" key
    | value -> value

let tryAndDefault (key: string) (defaultValue: string) =
    match System.Environment.GetEnvironmentVariable key with
    | null
    | "" -> defaultValue
    | value -> value
