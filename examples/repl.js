import { prompt } from "../index.js"

const completions = [
  "bye",
  "exit",
  "help",
  "hide",
  "histclear",
  "history",
  "passphrase",
  "quit",
]

const myPrompt = "\x1b[34m>>> \x1b[0m"

let password = false

/**
 * @param {string} input
 * @param {import("../index.js").InterfaceExtended} rl
 * @param {Partial<import("../index.js").Options>} [opts]
 */
const handleInput = (input, rl, opts = {}) => {
  if (password) {
    rl.setPrompt(myPrompt)
    opts.silent = false
    password = false

    return
  }

  switch (input.trim()) {
    case "hide":
      opts.silent = true
      password = true
      break
    case "help":
      console.log("HELP!!!")
      break
    case "histclear":
      rl.history = []
      break
    case "passphrase":
      rl.setPrompt("\x1b[35m>>> ")
      opts.silent = true
      password = true
      break
    case "bye":
    case "exit":
    case "quit":
      opts.repl = false
      break
    case "history":
      rl.history?.forEach((h, i) => console.log(`${i}: ${h}`))
      break
    default:
      if (!opts.silent) console.log("Unknown command: ", input)
      break
  }
}

prompt(myPrompt, { repl: true, handleInput, completions })
