API="http://localhost:4741"
URL_PATH="/paintings"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "painting": {
      "title": "'"${TITLE}"'",
      "artist": "'"${ARTIST}"'",
      "location": "'"${LOCATION}"'",
      "movement": "'"${MOVEMENT}"'"
    }
  }'

echo
