# Enriches a list of issues

Starting from a JSON list of issues - file `issues.json`,
the script requests a git repo to extract comments,
and produces an expanded list of issues WITH comments:

```shell
GIT_TOKEN=333333333 node enrich.js
cat enriched.json | jq -C
```

Optional env variables:
- GIT_ENDPOINT: URL to the root endpoint of your git API
- GIT_OWNER
- GIT_REPO 
