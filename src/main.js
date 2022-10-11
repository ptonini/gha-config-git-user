// Load .env file for local testing
require('dotenv').config();

const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')

async function main() {
    const token = core.getInput("token", { required: true })
    const username = core.getInput("username", { required: true })
    const client = github.getOctokit(token)
    const {data: user} = await client.rest.users.getByUsername({username: username})
    const name = user.name ?? user.login
    const email = user.email ?? `${user.id}+${user.login}@users.noreply.github.com"`
    core.setOutput("name", name)
    core.setOutput("email", email)
    await exec.exec("git", ["config", "--global", "user.name", name])
    await exec.exec("git", ["config", "--global", "user.email", email])
}

main().catch(error => {core.setFailed(error)});
