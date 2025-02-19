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

[ ] Move `manage` and `monitor` scripts out of folders for better autocomplete and use VSCode custom icons or tagging to differentiate the files
[ ] Add monitoring net worth to side bar
[ ] Cache server information to `data/` (e.g. server name, is purchased)
