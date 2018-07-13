// Usage
if (!process.env.GIT_TOKEN) {
  console.log("Please specify a GIT_TOKEN env variable.")
  process.exit(1)
}
const endpoint = process.env.GIT_ENDPOINT || "https://wwwin-github.cisco.com/api/v3"
const owner = process.env.GIT_OWNER || "DevNet-PubHub"
const repo = process.env.GIT_REPO || "cisco-api-style-guide"

// Git library: https://github.com/octokit/rest.js
const octokit = require('@octokit/rest')({
  timeout: 0, // 0 means no request timeout
  headers: {
    accept: 'application/vnd.github.v3+json',
    'user-agent': 'octokit/rest.js v1.2.3' // v1.2.3 will be current version
  },
  // custom GitHub Enterprise URL
  baseUrl: endpoint,
  // Node only: advanced request options can be passed as http(s) agent
  agent: undefined
})

//
octokit.authenticate({
  type: 'token',
  token: process.env.GIT_TOKEN
})

async function paginate(method) {
  let response = await method({
    owner: owner,
    repo: repo,
    state: 'all',
    per_page: 100
  })
  let { data } = response
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response)
    data = data.concat(response.data)
  }
  return data
}

// Main code logic: fetch all issues (paginate if needed), then enrich them
paginate(octokit.issues.getForRepo)
  .then(filterOutPullRequests)
  .then(enrichWithComments)
  .catch((err) => {
    if (err.code === 401) {
      console.log(`could not authenticate against ${endpoint}`)
      console.log("check your GIT_TOKEN")
      return
    }
    
    console.log(`could not fetch issues, err: ${err.message}`)
  })


function filterOutPullRequests(issues) {
  return new Promise(function (resolve, reject) {
    if (!issues) resolve(null)
    resolve(issues.filter((issue) => { return (!issue.pull_request) }))
  })
}

// List issues, and enrich with comments
const request = require("request")
function enrichWithComments(issues) {
  const actions = issues.map(enrichIssue)
  Promise.all(actions)
    .then((issuesWithComments) => {
      const output_file = "./issues.json"
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

      console.log(`found ${comments.length} comments for issue: ${issue.number}`)
      const commentsCurated = comments.map((comment) => {
        return {
          author: comment.user.login,
          body: comment.body
        }
      })

      console.log(`found ${issue.labels.length} labels for issue: ${issue.number}`)
      const labelsCurated = issue.labels.map((label) => {
        return label.name
      })

      // prep result
      let issuesCurated = {
        number: issue.number,
        state: issue.state,
        createdBy: issue.user.login,
        assignee: null,
        title: issue.title,
        body: issue.body,
        commentsUrl: issue.comments_url,
        commentsCount: issue.comments,
      }
      if (issue.assignee) {
        issuesCurated.assignee = issue.assignee.login
      }
      issuesCurated.comments = commentsCurated
      issuesCurated.labels = labelsCurated
      resolve(issuesCurated)
    });
  });
}