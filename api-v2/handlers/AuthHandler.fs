module AuthHandler

open System
open System.Text
open Giraffe
open Microsoft.AspNetCore.Http
open Microsoft.IdentityModel.Tokens
open System.IdentityModel.Tokens.Jwt
open System.Security.Claims

// --- Types ---

type SignupRequest = { Email: string; Password: string }
type LoginRequest = { Email: string; Password: string }
type AuthResponse = { Token: string }
type ErrorResponse = { Error: string }

// --- JWT ---

let private generateToken (userId: Guid) (email: string) =
    let secret = Env.require "JWT_SECRET"
    let key = SymmetricSecurityKey(Encoding.UTF8.GetBytes secret)
    let creds = SigningCredentials(key, SecurityAlgorithms.HmacSha256)

    let claims =
        [| Claim(ClaimTypes.NameIdentifier, userId.ToString())
           Claim(ClaimTypes.Email, email) |]

    let token =
        JwtSecurityToken(
            claims = claims,
            expires = DateTime.UtcNow.AddDays 365,
            signingCredentials = creds
        )

    JwtSecurityTokenHandler().WriteToken token

// --- Handlers ---

let signup (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! body = ctx.BindJsonAsync<SignupRequest>()
        let existing = UserRepository.getByEmail body.Email

        match User.handle (User.Signup(body.Email, body.Password)) existing with
        | Error msg ->
            ctx.Response.StatusCode <- 409
            return! json { Error = msg } next ctx
        | Ok(User.UserSignedUp(id, email, hash, trackedShowIds)) ->
            UserRepository.create id email hash trackedShowIds
            let token = generateToken id email
            return! json { Token = token } next ctx
        | Ok _ -> return! ServerErrors.internalError (text "Unexpected event") next ctx
    }

let login (next: HttpFunc) (ctx: HttpContext) =
    task {
        let! body = ctx.BindJsonAsync<LoginRequest>()
        let existing = UserRepository.getByEmail body.Email

        match User.handle (User.Login(body.Email, body.Password)) existing with
        | Error msg ->
            ctx.Response.StatusCode <- 401
            return! json { Error = msg } next ctx
        | Ok(User.LoginSucceeded(id, email)) ->
            let token = generateToken id email
            return! json { Token = token } next ctx
        | Ok _ -> return! ServerErrors.internalError (text "Unexpected event") next ctx
    }
