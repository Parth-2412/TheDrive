import crypto_utils
import getpass

def main():
    # Step 1: Generate a mnemonic
    mnemonic = crypto_utils.create_mnemonic()

    # Step 2: Take passphrase as input
    passphrase = getpass.getpass("Enter passphrase (leave empty for none): ")

    print(f"#Mnemonic: {mnemonic}")
    auth_keypair = crypto_utils.derive_auth_keypair(mnemonic, passphrase)
    print(f"AI_NODE_PUBLIC_KEY={auth_keypair['public_key'].hex()}")
    print(f"AI_NODE_PRIVATE_KEY={auth_keypair['secret_key'].hex()}")

    master_key = crypto_utils.derive_master_key_bytes(mnemonic, passphrase)
    print(f"AI_NODE_MASTER_KEY={master_key.hex()}")

if __name__ == "__main__":
    main()
