# Issues beautifyer: from JSON to the command line

Utility to visualize issues in a pretty

Generate a list of issues from the [node exporter utility](../all_in_one),
and place the generated `issues.json` file in the current directory.

Then on the command line

```shell
issues ls
issues ls --all

issues show #1

issues export > listing.txt
```


## Tips for future enhancements

- `npm install -g vmd`: view markdown in a desktop app (Electron app)
- [marked-terminal](https://www.npmjs.com/package/marked-terminal): Node.js module to render markdown in the terminal
