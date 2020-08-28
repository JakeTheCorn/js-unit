const unittest = require('./unittest')

// listener?

class Hooks extends unittest.Hooks {
    onStart() {}

    onFailure() {

    }

    onFunctionTimeout() {

    }

    onComplete() {

    }

    onAllPassed() {}
}


module.exports = Hooks
