const unittest = require('../unittest')

class FailFastTests extends unittest.TestCase {
    test_pass() {}

    test1() {
        this.fail('ONLY ONE ERROR SHOULD BE SHOWN')
    }

    test2() {
        this.fail('ONLY ONE ERROR SHOULD BE SHOWN')
    }
}


unittest.register(FailFastTests).run_if_main(module)
