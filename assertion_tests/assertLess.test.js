const unittest = require("../unittest")
const { UnittestError } = unittest.errors


class AssertLengthEqualTests extends unittest.TestCase {
    test_type_error() {
        const r = /assertLess must be called with numbers/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertLess('', null)
        })
    }

    test_pass() {
        this.assertLess(4, 5)
    }

    test_it_fails_when_numbers_are_equal() {
        const r = /3 is not less than 3. 3 === 3/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertLess(3, 3)
        })
    }

    test_it_fails_when_number_is_greater_than() {
        const r = /4 is not less than 3. 4 > 3/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertLess(4, 3)
        })
    }
}

unittest.register(AssertLengthEqualTests).run_if_main(module)
