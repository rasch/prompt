import { exit } from "node:process"
import { prompt } from "../index.js"

async function main() {
  const user = await prompt("Username: ")
  const pass = await prompt("Password: ", { silent: true })

  console.log(`${user}:${pass}`)
}

main().catch(error => {
  console.error(error)
  exit(1)
})
