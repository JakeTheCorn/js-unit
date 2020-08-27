const unittest = require("../unittest")
const { UnittestError } = unittest.errors


class AssertGreaterEqualTests extends unittest.TestCase {
    test_type_error() {
        const r = /assertGreaterEqual must be called with numbers/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertGreaterEqual('', null)
        })
    }

    test_pass() {
        this.assertGreaterEqual(5, 4)
        this.assertGreaterEqual(5, 5)
    }

    test_it_fails_when_number_is_less_than() {
        const r = /3 is not greater than or equal to 4. actual < expected/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertGreaterEqual(3, 4)
        })
    }
}

unittest.register(AssertGreaterEqualTests).run_if_main(module)
