# crypto_utils.py

from mnemonic import Mnemonic
import nacl.signing
import nacl.encoding
import hashlib
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend


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