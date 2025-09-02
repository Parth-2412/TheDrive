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
