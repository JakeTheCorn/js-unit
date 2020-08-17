const fs = require('fs')

all('./')

function all(path) {
    fs.readdir(path, { encoding: 'UTF-8' }, (_err, files) => {
        for (const file of files) {
            let f = path + file
            if (file === '.git') {
                continue
            }
            if (fs.lstatSync(f).isDirectory()) {
                return all(f + '/')
            }
            if (!/\.test\.js/.test(f)) {
                continue
            }
            require(f)
        }
        require('./unittest').main()
    })
}
