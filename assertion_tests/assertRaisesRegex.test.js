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
            this.assertRaisesRegex(Err, '^Hello World$', noop)
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

    test_it_throws_TypeError_when_func_arg_is_not_function() {
        this.assertRaises(TypeError, () => {
            this.assertRaisesRegex(Err, 'bad_pattern', '')
        })
    }

    test_it_throws_TypeError_when_regex_arg_is_non_string_or_regex() {
        this.assertRaisesRegex(TypeError, 'regex or string', () => {
            this.assertRaisesRegex(Err, null, noop)
        })
    }
}


function noop() {}


unittest.register(AssertRaisesRegexTests).run_if_main(module)
