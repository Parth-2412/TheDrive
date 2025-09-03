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


import base64
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.exceptions import InvalidTag

GCM_IV_LEN = 12
GCM_TAG_LEN = 16

def encrypt_input_bytes(input_bytes: bytes, master_aes_key: bytes, *, aad: bytes | None = None) -> str:
    iv = os.urandom(GCM_IV_LEN)
    cipher = Cipher(algorithms.AES(master_aes_key), modes.GCM(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    if aad:
        encryptor.authenticate_additional_data(aad)
    ciphertext = encryptor.update(input_bytes) + encryptor.finalize()
    tag = encryptor.tag  # 16 bytes by default
    combined = iv + ciphertext + tag
    return base64.b64encode(combined).decode("utf-8")

def decrypt_input_bytes(encrypted_input_base64: str, master_aes_key: bytes, *, aad: bytes | None = None) -> bytes:
    combined = base64.b64decode(encrypted_input_base64)
    if len(combined) < GCM_IV_LEN + GCM_TAG_LEN:
        raise ValueError("Encrypted payload too short to contain IV and tag.")

    iv = combined[:GCM_IV_LEN]
    tag = combined[-GCM_TAG_LEN:]
    ciphertext = combined[GCM_IV_LEN:-GCM_TAG_LEN]

    print("============================", iv)
    print("============================", tag)
    print("============================", ciphertext)

    cipher = Cipher(algorithms.AES(master_aes_key), modes.GCM(iv, tag), backend=default_backend())
    decryptor = cipher.decryptor()
    if aad:
        decryptor.authenticate_additional_data(aad)
    try:
        return decryptor.update(ciphertext) + decryptor.finalize()
    except InvalidTag as e:
        # Wrong key, IV, tag, AAD, or corrupted data
        raise ValueError("GCM authentication failed (bad tag/AAD/key/IV or corrupted ciphertext).") from e

def encrypt_input(s: str, master_aes_key: bytes, *, aad: bytes | None = None) -> str:
    return encrypt_input_bytes(s.encode("utf-8"), master_aes_key, aad=aad)

def decrypt_input(enc_b64: str, master_aes_key: bytes, *, aad: bytes | None = None) -> str:
    return decrypt_input_bytes(enc_b64, master_aes_key, aad=aad).decode("utf-8")
