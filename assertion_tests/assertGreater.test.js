const unittest = require("../unittest")
const { UnittestError } = unittest.errors


class AssertGreaterTests extends unittest.TestCase {
    test_type_error() {
        const r = /assertGreater must be called with numbers/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertGreater('', null)
        })
    }

    test_pass() {
        this.assertGreater(5, 4)
    }

    test_it_fails_when_numbers_are_equal() {
        const r = /3 is not greater than 3. actual === expected/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertGreater(3, 3)
        })
    }

    test_it_fails_when_number_is_less_than() {
        const r = /3 is not greater than 4. actual < expected/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertGreater(3, 4)
        })
    }
}

unittest.register(AssertGreaterTests).run_if_main(module)
