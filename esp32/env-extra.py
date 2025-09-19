
from os.path import isfile
Import("env")

if isfile(".env"):
    with open(".env") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue  # skip empty or comments
            key, value = line.split("=", 1)
            # Wrap values in quotes for C++ string literals
            env.Append(BUILD_FLAGS=[f'-D{key}=\\"{value}\\"'])
else:
    print("⚠️ .env file not found")

