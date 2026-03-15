module Database

open DbUp
open Npgsql
open System.Reflection

let private parseConnectionString (url: string) =
    let uri = System.Uri url
    let userInfo = uri.UserInfo.Split(':')
    let builder = NpgsqlConnectionStringBuilder()
    builder.Host <- uri.Host
    builder.Port <- uri.Port
    builder.Database <- uri.AbsolutePath.TrimStart('/')
    builder.Username <- userInfo.[0]
    builder.Password <- userInfo.[1]
    builder.SslMode <- SslMode.Prefer
    builder.ToString()

let connectionString =
    System.Environment.GetEnvironmentVariable("DATABASE_URL")
    |> parseConnectionString

let createConnection () = new NpgsqlConnection(connectionString)

let runMigrations () =
    let result =
        DeployChanges.To
            .PostgresqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
            .LogToConsole()
            .Build()
            .PerformUpgrade()

    if result.Successful then
        printf "[DbUp] Migrations applied successfully"
    else
        failwithf "[DbUp] Migration failed: %s" result.Error.Message
