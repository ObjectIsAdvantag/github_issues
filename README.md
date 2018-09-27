# Utilities to share Github issues

**Why: you want to share Github issues with non-members of a private repo? If so, you're at the right place.**

> Root cause: even though you can share code by creating a new remote, there is no easy way to extract a list of issues (including comments). The github api will give you [a list of issues (without comments)](https://developer.github.com/v3/issues/#response), and another enpoint will give you all comments for an issue. Job here is to extract all issues, filter out pull requests, iterate over comments, consolidate a list and pretty print it.

## How to use

Basically, you would:
- run the [extract script](./extract) to export a list of issues from a git repo,
- then run the [enrich script](./enrich) to generate a full issues list (with comments) as JSON,
- and finally run the [beautifier cli](./cli) against the JSON.

**OR simply run the [all_in_one](./all_in_one) script**, and then the beautifier.

You'll get such as JSON array:

```javascript
[
    {
        "number": 87,
        "state": "closed",
        "createdBy": "agentle",
        "assignee": "agentle",
        "title": "Consider adding the following list of references",
        "body": "## Cisco Line of Business or API Category\r\nCould we add a page that describes further reading? \r\n\r\nRoy Fielding in his doctoral dissertation http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm\r\nREST API Cheat Sheets\r\ni. API Design Cheat Sheet - This GitHub repository outlines important tips to consider when designing APIs that developers love.\r\nii. Platform-Building Cheat Sheet - Everyone wants to build a platform. This GitHub repository is a public receptacle of ground rules when building a platform.\r\nRESTful Best Practices guide\r\ni. PDF (~306KB)\r\nii. ePub (~46KB). Works on iPad, iPhone, B&N Nook and most other readers.\r\niii. Mobi (~86KB). Works on Kindle, Kindle Reader Apps\r\niv. Source Document in Libre/Open Office format (~48KB)\r\nBooks (4 of the 5 are available on Safari Books Online)\r\ni. REST API Design Rulebook, Mark Masse, 2011, O’Reilly Media, Inc.\r\nii. RESTful Web Services, Leonard Richardson and Sam Ruby, 2008, O’Reilly Media, Inc.\r\niii. RESTful Web Services Cookbook, Subbu Allamaraju, 2010, O’Reilly Media, Inc.\r\niv. REST in Practice: Hypermedia and Systems Architecture, Jim Webber, et al., 2010, O’Reilly Media, Inc.\r\nv. APIs: A Strategy Guide, Daniel Jacobson; Greg Brail; Dan Woods, 2011, O'Reilly Media, Inc.\r\n\r\nPlace an `x` between the square brackets `[ ]` to select a category:\r\n\r\n[ ] IoT\r\n[ ] Cloud\r\n[ ] Networking\r\n[ ] Data Center\r\n[ ] Security\r\n[ ] Analytics Automation\r\n[ ] Open Source\r\n[ ] Collaboration\r\n[ ] Mobility\r\n[x ] Other\r\n\r\n## Expectation\r\nFrom Matthew Farrell after reading through the guide.\r\n## How expectation was not met\r\n\r\n## Steps to recreate (if needed)\r\n\r\n## Related links or content\r\n",
        "commentsUrl": "https://wwwin-github.cisco.com/api/v3/repos/DevNet-PubHub/cisco-api-style-guide/issues/87/comments",
        "commentsCount": 2,
        "comments": [
            {
                "author": "stsfartz",
                "body": "Definitely, let's add a page.\r\n"
            },
            {
                "author": "stsfartz",
                "body": "@agentle assigning to you as owner of the section"
            }
        ]
    }
]
```

### Beautifier

Use the provided [beautifier CLI](./cli) to pretty print the JSON list of issues and associated comments.
