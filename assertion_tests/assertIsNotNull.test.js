const unittest = require("../unittest")
const { UnittestError } = unittest.errors

class AssertIsNotNullTests extends unittest.TestCase {
    test_pass() {
        this.assertIsNotNull(1)
    }

    test_fail() {
        this.assertRaisesRegex(UnittestError, /assertIsNotNull called with null/, () => {
            this.assertIsNotNull(null)
        })
    }
}


unittest.register(AssertIsNotNullTests).run_if_main(module)
