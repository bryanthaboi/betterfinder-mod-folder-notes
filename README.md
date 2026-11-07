# betterfinder-mod-folder-notes

[![release](https://img.shields.io/github/v/release/bryanthaboi/betterfinder-mod-folder-notes)](https://github.com/bryanthaboi/betterfinder-mod-folder-notes/releases)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![betterfinder](https://img.shields.io/badge/betterfinder-mod-8a5cf6)](https://github.com/bryanthaboi/betterfinder)

sticky notes per folder, qspace style. open a folder, see the notes u left there.

## grants

- `storage`: notes live here, keyed by folder
- `ui`: panel, toolbar, context menu

there is no text box node in the mod ui yet, so u type the note into the folder notes settings pane and hit add. it saves to the folder u are in and clears the draft. undo pops the latest, clear wipes the folder. 50 notes per folder max.

## install

browse tab in betterfinder settings, or grab `folder-notes.bfmod` from the [latest release](https://github.com/bryanthaboi/betterfinder-mod-folder-notes/releases/latest). nothing turns on until u approve the grants.

## build it urself

```sh
betterfinder-mod validate .
betterfinder-mod package . --out folder-notes.bfmod
```

mit. do whatever.
