const unittest = require("../unittest")
const { UnittestError } = unittest.errors

class AssertIsNotNullTests extends unittest.TestCase {
    testPass() {
        this.assertIsNotNull(1)
    }

    testFail() {
        const r = /assertIsNotNull called with null/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertIsNotNull(null)
        })
    }
}

unittest.register(AssertIsNotNullTests).run_if_main(module)
