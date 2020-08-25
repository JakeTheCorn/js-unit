const unittest = require("../unittest")

class IsFalseTests extends unittest.TestCase {
    test_pass() {
        this.assertIsFalse(false)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /true !== false/, () => {
            this.assertIsFalse(true)
        })
    }
}

unittest.register(IsFalseTests).run_if_main(module)
