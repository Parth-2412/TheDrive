import os
import json
import requests
from pathlib import Path
from crypto_utils import create_mnemonic, derive_auth_keypair
import base64

def generate_users_from_folder(base_folder: str, api_url: str = "http://localhost:8000/api/auth/register/"):
    """
    Generate users from a folder structure where each subfolder represents a user
    with their info.json file.
    
    base_folder: Path to the folder containing user subfolders
    api_url: URL of the registration endpoint
    """
    base_path = Path(base_folder)
    
    # Store user credentials for later use
    credentials = []
    
    for user_folder in base_path.iterdir():
        if not user_folder.is_dir():
            continue
            
        info_file = user_folder / "info.json"
        if not info_file.exists():
            print(f"Warning: No info.json found in {user_folder}")
            continue
            
        try:
            # Read user info
            with open(info_file, 'r') as f:
                user_info = json.load(f)
                
            # Generate cryptographic materials
            mnemonic = create_mnemonic()
            keypair = derive_auth_keypair(mnemonic)
            
            # Convert bytes to hex for API request
            public_key_hex = keypair["public_key"].hex()
            private_key_hex = keypair["secret_key"].hex()
            
            # Register user
            response = requests.post(
                api_url,
                json={"public_key": public_key_hex}
            )
            
            if response.status_code == 201:
                print(f"Successfully registered user from folder: {user_folder.name}")
                
                # Store credentials
                credentials.append({
                    "folder_name": user_folder.name,
                    "user_info": user_info,
                    "mnemonic": mnemonic,
                    "public_key": public_key_hex,
                    "private_key": private_key_hex
                })
            else:
                print(f"Failed to register user from {user_folder.name}")
                print(f"Response: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"Error processing folder {user_folder}: {str(e)}")
    
    # Save credentials to file
    if credentials:
        output_file = base_path / "generated_credentials.json"
        with open(output_file, 'w') as f:
            json.dump(credentials, f, indent=2)
        print(f"\nCredentials saved to: {output_file}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate users from folder structure")
    parser.add_argument("folder", help="Path to base folder containing user subfolders")
    parser.add_argument("--api", help="API URL for registration", 
                       default="http://localhost:8000/api/auth/register/")
    
    args = parser.parse_args()
    generate_users_from_folder(args.folder, args.api)