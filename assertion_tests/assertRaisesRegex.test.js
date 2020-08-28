const unittest = require("../unittest")

class Err extends Error {}

class AssertRaisesRegexTests extends unittest.TestCase {
    test_pass() {
        this.assertRaisesRegex(Err, /Hello World/, () => {
            throw new Err('Hello World')
        })
    }

    test_does_not_raise() {
        this.assertRaisesRegex(Error, /did not throw/g, () => {
            this.assertRaisesRegex(Err, '^Hello World$', () => {})
        })
    }

    test_strings_for_regex() {
        this.assertRaisesRegex(Err, '^Hello World$', () => {
            throw new Err('Hello World')
        })
    }

    test_quotation_marks_around_string_messages() {
        this.assertRaisesRegex(Error, '"Hello World" ', () => {
            this.assertRaisesRegex(Err, 'bad_pattern', () => {
                throw new Err('Hello World')
            })
        })
    }
}

unittest.register(AssertRaisesRegexTests).run_if_main(module)
