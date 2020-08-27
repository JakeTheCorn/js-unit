const unittest = require('./unittest')

// listener?

class Hooks extends unittest.Hooks {
    onFailure() {

    }

    onFunctionTimeout() {

    }

    onComplete() {

    }

    onAllPassed() {}
}


module.exports = Hooks
