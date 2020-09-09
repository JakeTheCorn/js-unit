const unittest = require("../unittest")


class IsFalseTests extends unittest.TestCase {
    test_pass() {
        this.assertFalse(false)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /"false" !== false/, () => {
            this.assertFalse('false')
        })
    }
}


unittest.register(IsFalseTests).run_if_main(module)
