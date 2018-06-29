// Usage
if (!process.env || !process.env.GIT_TOKEN) {
    console.log("Please specify a GIT_TOKEN env variable.")
    process.exit(1)
}
const endpoint = process.env.GIT_ENDPOINT || "https://wwwin-github.cisco.com/api/v3"
const owner = process.env.GIT_OWNER || "DevNet-PubHub"
const repo = process.env.GIT_REPO || "cisco-api-style-guide"

// List issues, and enrich with comments
const request = require("request")
const issues = require("./issues.json")
main(issues)

function main(issues) {
    const actions = issues.map(enrichIssue)
    Promise.all(actions)
        .then((issuesWithComments) => {
            const output_file = "./enriched.json"
            require('fs').writeFile(
                output_file,
                JSON.stringify(issuesWithComments, null, 4),
                (err, res) => {
                    if (err) {
                        console.log('could not write JSON file on disk')
                        return
                    }

                    console.log(`DONE! check file: ${output_file}`)
                }
            )
        })
        .catch(function (err) {
            console.log("error: " + err)
        })
}

function enrichIssue(issue) {
    // Fetch comments
    console.log(`fetching comments for issue number: ${issue.number}`)

    return new Promise(function (resolve, reject) {
        const options = {
            method: 'GET',
            url: `${endpoint}/repos/${owner}/${repo}/issues/${issue.number}/comments`,
            headers: { Authorization: `token ${process.env.GIT_TOKEN}` }
        }

        request(options, function (err, response, body) {
            if (err) return reject(err)

            const comments = JSON.parse(body)
            if (!comments) {
                console.log(`could not fetch comments for issue: ${issue.number}`)
                reject(new Error("could not fetch comments"))
                return
            }

            console.log(`found ${comments.length} for issue: ${issue.number}`)
            issue.comments = comments.map((comment) => {
                return {
                    author: comment.user.login,
                    body: comment.body
                }
            })

            resolve(issue)
        });
    });
}
