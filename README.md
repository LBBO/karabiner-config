# @mxstbr's Karabiner Elements configuration

If you like TypeScript and want your Karabiner configuration maintainable & type-safe, you probably want to use the custom configuration DSL / generator I created in `rules.ts` and `utils.ts`!

> “This repo is incredible - thanks so much for putting it together! I always avoided Karabiner mostly because of its complicated configuration. **Your project makes it so much easier to work with and so much more powerful. I'm geeking out on how much faster I'm going to be now.**”
>
> — @jhanstra ([source](https://github.com/mxstbr/karabiner/pull/4))

Watch the video about this repo:

[<img width="772" alt="CleanShot 2024-04-17 at 17 47 16@2x" src="https://github.com/mxstbr/karabiner/assets/7525670/c8565c48-10ad-4479-b690-ddc35d1ca8ce">](https://www.youtube.com/watch?v=j4b_uQX3Vu0)

Watch my interview with Raycast for a deeper dive into how I connect this with Raycast as my personal productivity system:

[![](https://github.com/mxstbr/karabiner/assets/7525670/f974cee3-ac92-4f80-8bf7-9efdf81f78b5)](https://www.youtube.com/watch?v=m5MDv9qwhU8)

You probably don't want to use my exact configuration, as it's optimized for my personal style & usage. Best way to go about using this if you want to? Probably delete all the sublayers in `rules.ts` and add your own based on your own needs!

## Installation

1. Install & start [Karabiner Elements](https://karabiner-elements.pqrs.org/)
2. Clone this repository
3. Delete the default `~/.config/karabiner` folder
4. Create a symlink with `ln -s ~/github/mxstbr/karabiner ~/.config` (where `~/github/mxstbr/karabiner` is your local path to where you cloned the repository)
5. [Restart karabiner_console_user_server](https://karabiner-elements.pqrs.org/docs/manual/misc/configuration-file-path/) with `` launchctl kickstart -k gui/`id -u`/org.pqrs.karabiner.karabiner_console_user_server ``
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
