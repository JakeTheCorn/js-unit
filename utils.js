const fs = require('fs')

class Utils {
    constructor(_fs = fs) {
        this._fs = _fs
    }

    readfile = async path => {
        return new Promise((resolve, reject) => {
            return this._fs.readFile(path, { encoding: 'UTF-8' }, (err, data) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }

    readdir = async path => {
        return new Promise((resolve, reject) => {
            return this._fs.readdir(path, { encoding: 'UTF-8' }, (err, files) => {
                if (err) {
                    return reject(err)
                }
                return resolve(files)
            })
        })
    }

    isDirectory = path => this._fs.lstatSync(path).isDirectory()
}

module.exports = Utils
