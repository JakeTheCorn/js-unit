const unittest = require("../unittest")
const { UnittestError } = unittest.errors


class AssertLessEqualTests extends unittest.TestCase {
    test_type_error() {
        const r = /assertLessEqual must be called with numbers/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertLessEqual('', null)
        })
    }

    test_pass() {
        this.assertLessEqual(4, 5)
        this.assertLessEqual(5, 5)
    }

    test_it_fails_when_number_is_greater_than() {
        const r = /4 is not less than or equal to 3. actual > expected/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertLessEqual(4, 3)
        })
    }
}


unittest.register(AssertLessEqualTests).run_if_main(module)
