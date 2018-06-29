# Build a JSON list of issues with comments

This Node.js script fetches all issues (with pagination) from a git repo,
then iterates over these issues to fetch comments,
and finally exports a JSON list of issues with comments.

Replace with your git token, and type on the command line:

`GIT_TOKEN=333333333 node paginate.js`

Optional env variables:
- GIT_ENDPOINT: URL to the root endpoint of your git API
- GIT_OWNER
- GIT_REPO 
