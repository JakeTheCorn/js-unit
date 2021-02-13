const unittest = require('./unittest')
const Utils = require('./lib/utils')
const utils = new Utils()

module.exports = unittest

main(process.argv)

async function main(args) {
    const cmd = args[2]
    if (cmd === undefined) {
        console.error('Command name missing, exiting...')
        return process.exit(1)
    }
    let data = null
    try {
        data = await utils.readfile('./config.json')
    } catch (error) {
        console.error(
`
Error trying to read configuration file.
  make sure that a config.json exists in the root directory
`)
        return process.exit(1)
    }
    const lines = data.split('\n')
    // remove json comments
    data = lines.filter(l => !/^.*\/\//.test(l)).join('')
    let parsed = null
    try {
        parsed = JSON.parse(data)
    } catch (error) {
        console.error(error)
        console.error('\n\nError trying to parse config.json file')
        return process.exit(1)
    }

    const commands = parsed['commands']
    if (commands === undefined) {
        console.error('Config file must specify a "commands" object.')
        return process.exit(1)
    }
    const config = commands[cmd]
    if (config === undefined) {
        console.error(`Could not find configuration for command "${cmd}".`)
        return process.exit(1)
    }
    if (!/\/$/.test(config.path)) {
        config.path = config.path + '/'
    }
    if (config.patterns === undefined) {
        console.error('Configuration object missing array of patterns.')
        return process.exit(1)
    }
    await all(config)
}

async function all({ path, patterns, classes, methods, fail_fast }) {
    const p = require('path')
    const testFiles = await getTestFilesNames({
        path: p.join(process.cwd(), path),
        patterns
    })
    for (const testFile of testFiles) {
        require(testFile)
    }

    unittest.set_only_classes(classes)
    unittest.set_only_methods(methods)
    unittest.set_fail_fast(fail_fast)
    unittest.main()
}



async function getTestFilesNames({ path, patterns }) {
    const testFiles = []
    const files = await utils.readdir(path)
    for (const file of files) {
        let f = path + file
        if (file === '.git' || file === 'node_modules') {
            continue
        }
        if (utils.isDirectory(f)) {
            const files = await getTestFilesNames({
                path: f + '/',
                patterns,
            })
            testFiles.push(...files)
        }
        const regexs = patterns.map(p => new RegExp(p))
        for (const regex of regexs) {
            if (regex.test(f)) {
                testFiles.push(f)
            }
        }
    }
    return testFiles
}


