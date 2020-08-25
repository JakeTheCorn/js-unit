const unittest = require("../unittest")
const { UnittestError } = unittest.errors

class AssertIsNotNullTests extends unittest.TestCase {
    test_pass() {
        this.assertIsNotNull(1)
    }

    test_fail() {
        const r = /assertIsNotNull called with null/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertIsNotNull(null)
        })
    }
}

// assertLengthEqual()

unittest.register(AssertIsNotNullTests).run_if_main(module)
