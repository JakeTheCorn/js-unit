const Utils = require('./utils')
const utils = new Utils()

main()

async function main() {
    await all({
        path: './',
        patterns: [
            '.ut.js',
            '.test.js'
        ],
    })
}

async function all({ path, patterns }) {
    const testFiles = await getTestFilesNames({
        path,
        patterns
    })
    for (const testFile of testFiles) {
        require(testFile)
    }
    require('./unittest').main()
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


