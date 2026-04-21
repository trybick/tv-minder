module PasswordHashing

open System
open System.Text
open System.Security.Cryptography
open Konscious.Security.Cryptography
open Primitives

let private hashBytes (password: string) : byte[] =
    use argon2 = new Argon2id(Encoding.UTF8.GetBytes password)
    argon2.Iterations <- 4
    argon2.MemorySize <- 65536
    argon2.DegreeOfParallelism <- 2
    argon2.GetBytes 32

let argon2Hasher : User.PasswordHasher =
    { Hash = fun password -> PasswordHash.create (hashBytes (RawPassword.value password))
      Verify =
        fun password hash ->
            let computed = hashBytes (RawPassword.value password)
            CryptographicOperations.FixedTimeEquals(ReadOnlySpan computed, ReadOnlySpan(PasswordHash.value hash)) }
