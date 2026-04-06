module Database

open DbUp
open Npgsql
open System.IO
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
    System.Environment.GetEnvironmentVariable "DATABASE_URL"
    |> parseConnectionString

/// Unused right now but can be used for code that accesses database later.
let createConnection () = new NpgsqlConnection(connectionString)

let runMigrations () =
    let result =
        DeployChanges.To
            .PostgresqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(
                Assembly.GetExecutingAssembly(),
                fun name -> name.Contains "database.migrations"
            )
            .LogToConsole()
            .Build()
            .PerformUpgrade()

    match result.Successful with
    | true -> printf "[DbUp] Migrations applied successfully"
    | false -> failwithf "[DbUp] Migration failed: %s" result.Error.Message


let runSeed () =
    let baseDir =
        Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)
        |> Option.ofObj
        |> Option.defaultValue "."

    // For now just seed a single file.  Can make this more flexible in future.
    let scriptPath = Path.Combine(baseDir, "database", "scripts", "seed_users.sql")

    if not (File.Exists scriptPath) then
        failwithf "[Seed] Script not found: %s" scriptPath

    let sql = File.ReadAllText scriptPath

    use connection = new NpgsqlConnection(connectionString)
    connection.Open()

    use cmd = new NpgsqlCommand(sql, connection)
    cmd.ExecuteNonQuery() |> ignore

    printfn "[Seed] Seed script completed"
