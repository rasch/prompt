import { prompt } from "../index.js"

const randomNumber = Math.floor(Math.random() * 100)

prompt("Guess what number I'm thinking of? ", {
  repl: true,

  /**
   * @param {string} input
   * @param {import("../index.js").InterfaceExtended} rl
   * @param {import("../index.js").Options} [opts]
   */
  handleInput(input, rl, opts = {}) {
    rl.setPrompt("Try Again? ")
    if (+input === randomNumber) {
      console.log("You guessed it!")
      opts.repl = false
    } else if (+input > randomNumber) {
      console.log("Nope. Too High.")
    } else {
      console.log("Nope. Too Low. ")
    }
  },
})
