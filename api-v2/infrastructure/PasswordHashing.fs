module PasswordHashing

open System
open System.Text
open System.Security.Cryptography
open Konscious.Security.Cryptography
open ValueObjects

[<Literal>]
let private SaltSize = 16

[<Literal>]
let private HashSize = 32

let private configureArgon2 (argon2: Argon2id) =
    argon2.Iterations <- 4
    argon2.MemorySize <- 65536
    argon2.DegreeOfParallelism <- 2

let private hashBytesLegacy (password: string) : byte[] =
    use argon2 = new Argon2id(Encoding.UTF8.GetBytes password)
    configureArgon2 argon2
    argon2.GetBytes HashSize

let private hashBytesWithSalt (password: string) (salt: byte[]) : byte[] =
    use argon2 = new Argon2id(Encoding.UTF8.GetBytes password)
    argon2.Salt <- salt
    configureArgon2 argon2
    argon2.GetBytes HashSize

let argon2Hasher: User.PasswordHasher =
    {
        Hash =
            fun password ->
                let salt = Array.zeroCreate<byte> SaltSize
                RandomNumberGenerator.Fill salt
                let hashPart = hashBytesWithSalt (RawPassword.value password) salt
                let combined = Array.zeroCreate<byte> (SaltSize + HashSize)
                Array.blit salt 0 combined 0 SaltSize
                Array.blit hashPart 0 combined SaltSize HashSize
                PasswordHash.create combined
        Verify =
            fun password stored ->
                let storedBytes = PasswordHash.value stored

                if storedBytes.Length = HashSize then
                    let computed = hashBytesLegacy (RawPassword.value password)

                    CryptographicOperations.FixedTimeEquals(
                        ReadOnlySpan computed,
                        ReadOnlySpan storedBytes
                    )
                elif storedBytes.Length < SaltSize + HashSize then
                    false
                else
                    let salt = storedBytes.AsSpan(0, SaltSize).ToArray()
                    let expected = storedBytes.AsSpan(SaltSize, HashSize)
                    let computed = hashBytesWithSalt (RawPassword.value password) salt
                    CryptographicOperations.FixedTimeEquals(ReadOnlySpan(computed), expected)
    }
