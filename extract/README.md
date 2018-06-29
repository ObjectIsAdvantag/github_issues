# Extracts a list of issues from a GIT_REPO

Requirements: curl and jq

Env variables: GIT_TOKEN, GIT_ENDPOINT, GIT_OWNER, GIT_REPO
From the command line, type `GIT_TOKEN="YOUR_GIT_TOKEN" ./extract-issues` to export the list of issues (all issues by default)

Type `cat issues.json | jq -C` for a pretty print of the JSON