# @LBBO's Karabiner Elements configuration
> Shamelessly stolen from [@mxstbr](https://github.com/mxstbr/karabiner)

If you like TypeScript and want your Karabiner configuration maintainable & type-safe, you probably want to use the custom configuration DSL / generator @mxstbr created in `rules.ts` and `utils.ts`!

Watch some videos about this repo:

[<img width="772" alt="CleanShot 2024-04-17 at 17 47 16@2x" src="https://github.com/mxstbr/karabiner/assets/7525670/c8565c48-10ad-4479-b690-ddc35d1ca8ce">](https://www.youtube.com/watch?v=j4b_uQX3Vu0)

[![](https://github.com/mxstbr/karabiner/assets/7525670/f974cee3-ac92-4f80-8bf7-9efdf81f78b5)](https://www.youtube.com/watch?v=m5MDv9qwhU8)

You probably don't want to use my exact configuration, as it's optimized for my personal style & usage. Best way to go about using this if you want to? Probably delete all the sublayers in `rules.ts` and add your own based on your own needs!

## Installation

1. Install & start [Karabiner Elements](https://karabiner-elements.pqrs.org/)
2. Clone this repository
3. Delete the default `~/.config/karabiner` folder
4. Create a symlink with `ln -s ~/github/mxstbr/karabiner ~/.config` (where `~/github/mxstbr/karabiner` is your local path to where you cloned the repository)
5. [Restart karabiner_console_user_server](https://karabiner-elements.pqrs.org/docs/manual/misc/configuration-file-path/) with `launchctl kickstart -k gui/$(id -u)/org.pqrs.karabiner.karabiner_console_user_server`
6. Add the `raycast-scripts` directory to your Raycast scripts by opening Raycast, going to the "Extensions" tab, searching for "Script Commands", click "Add Directories" and then choose the `raycast-scripts` directory in this repository
7. The "Open Google Calendar in Arc" script needs the calendar to have a specific name. For it to work, go into Arc, right-click on the pinned Google Calendar tab and rename it to `RAYCAST_TARGET_CALENDAR_TAB`. You may change this name, but you'll have to update the `open-calendar.applescript` file accordingly. Also, keep in mind that this name must be unique across all tabs you will ever have.

## Development

```
yarn install
```

to install the dependencies. (one-time only)

```
yarn run build
```

builds the `karabiner.json` from the `rules.ts`.

```
yarn run watch
```

watches the TypeScript files and rebuilds whenever they change.

## Vim Mode

This configuration includes a comprehensive Vim mode implementation that works across all applications (those with native Vim mode are excluded).

> [!WARNING]
> The Vim mode documentation is AI generated and thus probably not complete.

### Entering Vim Mode

- **Hyper + v**: Activates Vim Normal Mode
- You'll receive a notification confirming you're in Normal Mode

### Exiting Vim Mode

- **Escape**: Exits Vim Mode and returns to Insert Mode (which is just non-Vim mode)
- **Caps Lock**: Exits Vim Mode and returns to Insert Mode (which is just non-Vim mode)
- **Any key in native Vim apps**: Automatically exits Vim Mode when using apps with built-in Vim support (VS Code, JetBrains IDEs, etc.)

### Vim Mode Features

The implementation includes:

- **Normal Mode**: Full Vim navigation and editing commands
- **Visual Mode**: Text selection with `v`, then use motions to select
- **Delete Mode**: `d` followed by motions to delete text
- **Yank Mode**: `y` followed by motions to copy text
- **Change Mode**: `c` followed by motions to cut and enter insert mode (see below)

- **Insert Mode**: This is just your regular non-Vim mode. We don't enter Insert Mode as much as we leave any other mode.

### Key Mappings

#### Motions

- `h`, `j`, `k`, `l`: Arrow keys
- `w`: Next word
- `b`: Previous word
- `e`: End of word
- `0` or `^`: Beginning of line
- `$`: End of line
- `gg`: Go to top of document
- `G`: Go to bottom of document

#### Text Operations

- `x`: Delete character
- `p`: Paste
- `u`: Undo
- `Ctrl+r`: Redo

#### Mode Switching

- `i`: Enter Insert Mode
- `a`: Enter Insert Mode after cursor
- `o`: Open new line below and enter Insert Mode
- `v`: Enter Visual Mode
- `d`: Enter Delete Mode
- `y`: Enter Yank Mode
- `c`: Enter Change Mode

### Setting up Notifications

To receive Vim mode notifications, you need to grant notification permissions:

1. Open Terminal and run: `display notification "Test"`
2. Click "Allow" when the notification popup appears
3. This enables the Vim mode status notifications

## Setting up Deep Links

### Slack ([Docs](https://api.slack.com/reference/deep-linking#open_a_direct_message))

To open a specific user's chat, you need the team ID and user ID.

You can get the team ID by opening the team's slack in the browser, firing up the network tab and extracting it from the URL of the very first GET request. It should look like `https://app.slack.com/client/{teamID}/{something}`.

The user ID can be obtained by viewing the person's profile (it should open in the sidebar), then clicking on the three dots and clicking "Copy member ID".

The team ID always starts with a `T` and the user ID always starts with a `U`.

The final deep link will then be

```
slack://user?team={teamID}&id={userID}
```

### Telegram

Open a user's profile. If they have a username, it will be shown there (e.g. @somebody). The deep link will then be

```
tg://resolve?domain=@{username}
```

## License

Copyright (c) 2022 Maximilian Stoiber, licensed under the [MIT license](./LICENSE.md).
