#!/usr/bin/env bash

if [[ -n $FIRESTORE_TOKEN_PASS ]]; then
   gpg \
    --quiet \
    --batch \
    --yes \
    --decrypt \
    --passphrase="$FIRESTORE_TOKEN_PASS" \
    --output firestore-token.json \
    firestore-token.json.gpg
else
  echo "FIRESTORE_TOKEN_PASS is undefined." >&2
  exit 1
fi
