# prompt

> an interactive prompt for JavaScript CLI applications

## Install

```sh
pnpm add @rasch/prompt
```

<details><summary>npm</summary><p>

```sh
npm install @rasch/prompt
```

</p></details>
<details><summary>yarn</summary><p>

```sh
yarn add @rasch/prompt
```

</p></details>

## Quick Start

```javascript
import { prompt } from "@rasch/prompt"

const name = await prompt("What's your name? ")
const password = await prompt("Please enter your password: ", { silent: true })

console.log(`Welcome back, ${name}!`)
```

There are [additional examples available][1]!

## API

```plaintext
Options :: { silent: Boolean, completions: [String], repl: Boolean, handleInput: HandleInput }
HandleInput :: (String, Interface, Options) => Undefined

prompt :: (String, Options) -> Promise(String)
prompt(query, options)
```

### Import the Module

```javascript
import { prompt } from "@rasch/prompt"
```

### Simple Example

The original reason for this module is to hide the user input during password
authentication. The input is not printed to the console (like unix system
passwords) when the `silent` option is set to `true` and it is not saved to
history.

```javascript
const password = await prompt("Enter Password: ", { silent: true })
```

This prompt module can work for simple use cases...

```javascript
const answer = await prompt("Which way do you want to go? ")
```

...but is not really needed here, since the built-in [`rl.question`][2] does
nearly the same thing.

### Completions

Tab autocomplete is available by providing an `array` of `strings` to the
`completions` option. Completion is performed by simply filtering the
`array` based on what the current input starts with. Sorry, there is no fuzzy
filtering (currently).

```javascript
const answer = await prompt(
  "Which way do you want to go? ",
  { completions: "north south east west up down left right".split(" ") }
)
```

### REPL

A *READ-EVAL-PRINT* Loop is available by setting the `repl` option to `true`.
(Please use your favorite robot voice when reading the italic text in the
above sentence. Actually, that is the correct way to read **ALL** italicized
text.)

```javascript
const answer = await prompt(
  "Which way do you want to go? ", {
    repl: true,
    completions: "north south east west up down left right".split(" "),
  }
)
```

The REPL above is useless since it doesn't handle the user input. The option
`handleInput` should be provided with a callback function. The callback function
accepts up to three arguments:

- `input`: the trimmed `string` provided by the user
- `rl`: the [Readline Interface][3] which provides access to methods such as
  `rl.history`, `rl.setPrompt`, and `rl.write`.
- `opts`: the `object` that was provided to the `prompt` module. This allows
  the options, including `handleInput` itself, to be dynamically modified.

```javascript
const answer = await prompt(
  "Which way do you want to go? ", {
    repl: true,
    completions: "north south east west up down left right".split(" "),
    handleInput(input, rl, opts = {}) {
      switch (input) {
        case "north":
        case "up":
          opts.repl = false
          enterCastle()
          break
        case "east":
        case "right":
          console.log(
            "You entered the infinite Forest and somehow ended\n" +
            "up back where you started."
          )
          break
        case "south":
        case "down":
          opts.repl = false
          ohCoolASkatePark("Mission over! Let's skate instead.")
          break
        case "west":
        case "left":
          opts.repl = false
          enterPit("You fell in a deep pit just west of the castle!")
          break
        default:
          console.log(
            `You can't go "${input}". I don't even know what that is.`
          )
      }
    },
  }
)
```

[1]: https://github.com/rasch/prompt/tree/main/examples
[2]: https://nodejs.org/api/readline.html#rlquestionquery-options
[3]: https://nodejs.org/api/readline.html#class-interfaceconstructor
