# crypto_utils.py

from mnemonic import Mnemonic
import nacl.signing
import nacl.encoding
import hashlib
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
import base64

def create_mnemonic():
    mnemo = Mnemonic("english")
    return mnemo.generate(strength=128)

def mnemonic_to_seed(mnemonic: str, passphrase: str = "") -> bytes:
    mnemo = Mnemonic("english")
    return mnemo.to_seed(mnemonic, passphrase)

def hkdf(ikm: bytes, info: str, length: int = 32) -> bytes:
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=length,
        salt=bytes(32),  # 32 zero bytes
        info=info.encode(),
        backend=default_backend()
    )
    return hkdf.derive(ikm)

def derive_auth_keypair(mnemonic: str, passphrase: str = ""):
    seed = mnemonic_to_seed(mnemonic, passphrase)  # 64 bytes
    sk_seed = hkdf(seed, "auth-ed25519", 32)       # 32 bytes
    keypair = nacl.signing.SigningKey(sk_seed)
    return {
        "public_key": keypair.verify_key.encode(encoder=nacl.encoding.RawEncoder),
        "secret_key": keypair.encode(encoder=nacl.encoding.RawEncoder)
    }

def derive_master_key_bytes(mnemonic: str, passphrase: str = "") -> bytes:
    seed = mnemonic_to_seed(mnemonic, passphrase)
    return hkdf(seed, "master-encryption", 32)  # 32 bytes for AES-256

def generate_sha256_hash(input_string: str) -> str:
    return hashlib.sha256(input_string.encode("utf-8")).hexdigest()

def get_file_sha256_hash(file_path: str) -> str:
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


def encrypt_input_bytes(input_bytes: bytes, master_aes_key: bytes) -> str:
    # Generate a random 12-byte IV (Initialization Vector)
    iv = os.urandom(12)


    # Create the cipher and encrypt the input using AES-GCM
    cipher = Cipher(algorithms.AES(master_aes_key), modes.GCM(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_input = encryptor.update(input_bytes) + encryptor.finalize()

    # Combine the IV and the encrypted input
    combined = iv + encrypted_input

    # Return the base64-encoded result
    return base64.b64encode(combined).decode('utf-8')


def encrypt_input(input: str, master_aes_key: bytes) -> str:
    # Encode the input to bytes
    input_bytes = input.encode('utf-8')

    return encrypt_input_bytes(input_bytes, master_aes_key)


def decrypt_input_bytes(encrypted_input_base64: str, master_aes_key: bytes) -> bytes:
    # Base64 decode the encrypted input
    combined = base64.b64decode(encrypted_input_base64)
    
    # Extract the IV (first 12 bytes) and the encrypted input
    iv = combined[:12]
    encrypted_input = combined[12:]

    # Create the cipher and decrypt the input using AES-GCM
    cipher = Cipher(algorithms.AES(master_aes_key), modes.GCM(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_input = decryptor.update(encrypted_input) + decryptor.finalize()

    return decrypted_input

def decrypt_input(encrypted_input_base64: str, master_aes_key: bytes) -> str:
    # Decrypt the input bytes
    decrypted_input_bytes = decrypt_input_bytes(encrypted_input_base64, master_aes_key)

    # Convert decrypted bytes back to a string
    return decrypted_input_bytes.decode('utf-8')