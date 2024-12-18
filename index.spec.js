import { prompt } from "./index.js"
import { test } from "fvb"
import { Readable } from "node:stream"

// These tests don't cover everything in the `prompt` module due to its
// interactive nature. Since `prompt` is really just a wrapper around the
// node.js readline module, these interactive features are already tested
// within the node.js project itself.

const options = {
  input: Readable.from("hello\r"),
  terminal: false,
}

test("prompt - structure check", async t => {
  t.equal(typeof prompt, "function", "prompt is a function")

  await prompt("", {
    ...options,
    handleInput(input, rl, opts = {}) {
      t.equal(input, "hello", "given input string is correct")
      t.notOk(opts.terminal, "opts.terminal should be disabled for test")
      t.ok(Array.isArray(rl.history), "rl.history is an array")
      t.equal(
        typeof opts.handleInput,
        "function",
        "handleInput callback is a function"
      )
    }
  })
})

test("prompt - basic example", async t => {
  const answer = await prompt("", {
    ...options,
    input: Readable.from("\t   hello world    \r"),
  })

  t.equal(answer, "hello world", "given input string is correctly trimmed")
})

test("prompt - silent mode", async t => {
  await prompt("", {
    ...options,
    silent: true,
    handleInput(input, rl, opts = {}) {
      t.ok(opts.silent, "opts.silent should be enabled")
      t.equal(input, "hello", "given input string is correct")

      // This test does not actually work. Since terminal is set to false for
      // these tests, the history is disabled and will always have a length of 0.
      t.equal(rl.history?.length, 0, "silent mode input shouldn't be in history")
    }
  })
})

test("prompt - completions", async t => {
  await prompt("", {
    ...options,
    input: Readable.from("y"),
    completions: "yes no maybe".split(" "),
    handleInput(input, rl, opts = {}) {
      t.equal(input, "y", "given input string is correct")
      t.equal(typeof rl.close, "function", "the callback can close the prompt")
      t.equal(
        opts.completions?.length,
        3,
        "opts.completions should contain 3 values"
      )
    }
  })
})
