const unittest = require("../unittest")
const { UnittestError } = unittest.errors

class AssertEqualTests extends unittest.TestCase {
    test_number_equality() {
        this.assertEqual(1, 1)
    }

    test_string_equality() {
        this.assertEqual('hey', 'hey')
    }

    test_string_failure_message() {
        const r = /"hey" !== "no"/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertEqual('hey', 'no')
        })
    }
}

unittest.register(AssertEqualTests).run_if_main(module)
