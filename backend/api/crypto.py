from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

def verify_signature(message, signature_hex, public_key_hex) -> bool:
    """
    Verify an ED25519 signature.
    
    Args:
        message (str): The original message that was signed.
        signature_hex (str): Signature in hexadecimal string format.
        public_key_hex (str): Public key in hexadecimal string format.
    
    Returns:
        bool: True if signature is valid, False otherwise.
    
    Raises:
        ValueError: If the signature or public key format is invalid.
    """
    try:
        verify_key = VerifyKey(bytes.fromhex(public_key_hex))
        verify_key.verify(message.encode('utf-8'), bytes.fromhex(signature_hex))
        return True
    except BadSignatureError:
        return False
    except Exception as e:
        raise ValueError(f"Invalid input: {e}")