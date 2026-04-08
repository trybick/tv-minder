module Env

open System

let verifyEnvVariablesExist () =
    let requiredEnvVariables = [ "DATABASE_URL" ]

    requiredEnvVariables
    |> List.iter (fun s ->
        let maybeEnvVar = System.Environment.GetEnvironmentVariable s

        if String.IsNullOrEmpty maybeEnvVar then
            failwithf "Environment variable for %s not found" s)
