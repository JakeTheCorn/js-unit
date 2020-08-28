const unittest = require("../unittest")


class IsFalseTests extends unittest.TestCase {
    test_pass() {
        this.assertIsFalse(false)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /"false" !== false/, () => {
            this.assertIsFalse('false')
        })
    }
}


unittest.register(IsFalseTests).run_if_main(module)
