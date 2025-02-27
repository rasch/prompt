import { stdin, stdout } from "node:process"
import { createInterface, Interface } from "node:readline/promises"
import { Readable, Writable } from "node:stream"

/**
 * @typedef {object} HistoryField
 * @property {string[]} [history]
 * @typedef {Interface & HistoryField} InterfaceExtended
 */

/**
 * @callback HandleInput
 * @param {string} input
 * @param {InterfaceExtended} rl
 * @param {Partial<Options>} [opts]
 * @returns {void}
 */

/**
 * @typedef {object} Options
 * @property {boolean} [silent]
 * @property {string[]} [completions]
 * @property {boolean} [repl]
 * @property {HandleInput} [handleInput]
 * @property {boolean} [terminal] for testing
 * @property {Readable} [input] for testing
 */

/**
 * @param {string} query
 * @param {Options} [opts]
 */
export const prompt = (query, opts = {}) =>
  new Promise(resolve => {
    /** @type {string} */
    let answer

    const mutableStdout = new Writable({
      write: (chunk, encoding, callback) => {
        if (!opts.silent) stdout.write(chunk, encoding)
        callback()
      },
    })

    const rl = createInterface({
      prompt: query,
      input: opts.input ?? stdin,
      output: mutableStdout,
      terminal: opts.terminal ?? true,
      completer: line => [
        opts.completions?.filter(c => c.startsWith(line)) ?? [],
        line,
      ],
    })

    rl.prompt()

    if (opts.silent) stdout.write(rl.getPrompt())

    rl.on("history", history => {
      opts.silent && history.shift()
    })

    rl.on("line", input => {
      answer = input.trim()
      opts.silent && stdout.write("\n")
      opts.handleInput && opts.handleInput(answer, rl, opts)
      opts.repl ? rl.prompt() : rl.close()
      opts.silent && opts.repl && stdout.write(rl.getPrompt())
    })

    rl.on("close", () => {
      resolve(answer)
    })
  })
