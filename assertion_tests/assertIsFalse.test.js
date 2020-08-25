const unittest = require("../unittest")

class IsFalseTests extends unittest.TestCase {
    testPass() {
        this.assertIsFalse(false)
    }

    testFail() {
        this.assertRaisesRegex(Error, /true !== false/, () => {
            this.assertIsFalse(true)
        })
    }
}

unittest.register(IsFalseTests).run_if_main(module)
