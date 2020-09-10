const unittest = require('../unittest')


class SingleClassTests extends unittest.TestCase {
    test() {}
}

class ThisClassShouldNotRun extends unittest.TestCase {
    test() {
        this.fail('THIS SHOULD NOT RUN')
    }
}


unittest.register(SingleClassTests, ThisClassShouldNotRun).run_if_main(module)
