const Utils = require('./utils')

main()

async function main() {
    await all('./')
}

async function all(path) {
    const testFiles = await getTestFilesNames(path)
    for (const testFile of testFiles) {
        require(testFile)
    }
    require('./unittest').main()
}

async function getTestFilesNames(path = './') {
    const utils = new Utils()
    const testFiles = []
    const files = await utils.readdir(path)
    for (const file of files) {
        let f = path + file
        if (file === '.git' || file === 'node_modules') {
            continue
        }
        if (utils.isDirectory(f)) {
            const files = await getTestFilesNames(f + '/')
            testFiles.push(...files)
        }
        if (/\.test\.js/.test(f)) {
            testFiles.push(f)
        }
    }
    return testFiles
}


