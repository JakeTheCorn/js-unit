const unittest = require('./unittest')

// listener?

class Hooks extends unittest.Hooks {
    onStart() {
        // console.log('on start hook...')
    }

    onFailure() {
        // console.log('on failure')
    }

    onComplete() {
        // console.log('on complete')
    }

    onAllPassed() {
        // console.log('on all passed')
    }
}


module.exports = Hooks
