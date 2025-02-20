## Adding / updating scripts

Add and edit scripts in the `scripts` folder, which will sync to the home
directory.

## Updating the NS API

Download the latest NS typescript definitions from
[NetscriptDefinitions.d.ts](https://github.com/bitburner-official/bitburner-src/blob/dev/src/ScriptEditor/NetscriptDefinitions.d.ts)

And then add the following to the top of the file:

```
declare global { const NS: NS; }
```

## TODOs

[ ] Add monitoring net worth to side bar
[ ] Fix proper 2-coloring coding contract solver
[ ] Make total ways to sum coding contract solvers not take forever
