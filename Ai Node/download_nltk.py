# fix_nltk.py
import nltk
import ssl

# This part temporarily disables the certificate check
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# This part downloads the two required packages using their correct names
print("Attempting to download 'punkt'...")
nltk.download('punkt')
print("--- 'punkt' downloaded. ---")

print("\nAttempting to download 'averaged_perceptron_tagger'...")
nltk.download('averaged_perceptron_tagger')
print("--- 'averaged_perceptron_tagger' downloaded. ---")

print("\n✅ All necessary NLTK data has been downloaded.")