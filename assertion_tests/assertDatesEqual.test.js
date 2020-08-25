const unittest = require("../unittest")
const { UnittestError } = unittest.errors

class AssertDatesEqualTests extends unittest.TestCase {
    test_type_error_when_called_with_non_dates() {
        const r = /Should be called with dates/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertDatesEqual(1, 1)
        })
    }

    test_it_does_not_throw_when_called_with_dates() {
        // TypeError?
        this.assertDoesNotThrow(() => {
            const d = new Date()
            this.assertDatesEqual(d, d)
        })
    }
}

unittest.register(AssertDatesEqualTests).run_if_main(module)
