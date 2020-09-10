const unittest = require('../unittest')

// ONLY ONE ERROR SHOULD BE SHOWN

class FailFastTests extends unittest.TestCase {
    test_pass() {}

    test1() {
        this.fail('THIS METHOD SHOULD NOT RUN')
    }

    test2() {
        this.fail('THIS METHOD SHOULD NOT RUN')
    }
}


unittest.register(FailFastTests).run_if_main(module)
