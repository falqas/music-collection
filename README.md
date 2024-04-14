# Music Collection CLI

## Introduction

Simple command line application to manage your music collection

## Instructions

1. (Optional): Clone this repo if desired (although you really only need 2 files: `music` and `index.js`)
2. Make the `music` script executable by running `chmod +x music`
3. Run `./music`

## How to Use

From the prompt within the script, the following commands are available to you:

- `demo` for a demonstration of the core features
- `add "album title" "artist name"` to add new albums
- `play "album title"` to mark an album as played
- `show all` or `show unplayed` to view your collection
- `show all by "artist name"` or `show unplayed by "artist name"` for a filtered view

## Considerations/future builds:

1. Better error handling ("Did you mean $cmd" rather than "Invalid command")
2. Refactor the `parseUserInput` function to return one of the "command function" (e.g. `parseAddCommand`) to reduce coupling and enhance testability
3. Add more integration tests for parsing functions & readline module
4. Add support for non-alphanumeric characters for artist or title (e.g. `Paul's Boutique` vs `Pauls Boutique`)
5. Add regex for more complex input parsing
