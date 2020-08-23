const unittest = require('./unittest')

// test arrays

class AssertObjectEqualTests extends unittest.TestCase {
    test_empty_object() {
        this.assertObjectEqual({}, {})
    }

    test_it_throws_error_when_expected_type_is_not_object() {
        const r = /assertObjectEqual expects an object for 2nd \(expected\) param/
        this.assertRaisesRegex(Error, r, () => {
            this.assertObjectEqual({}, '')
        })
    }

    test_it_throws_error_when_actual_type_is_not_object() {
        const r = /assertObjectEqual expects an object for 1st \(actual\) param/
        this.assertRaisesRegex(Error, r, () => {
            this.assertObjectEqual('', {})
        })
    }

    test_it_throws_error_when_actual_is_array_and_expected_is_object() {
        const r = /assertObjectEqual expects an object for 1st \(actual\) param/
        this.assertRaisesRegex(Error, r, () => {
            this.assertObjectEqual([], {})
        })
    }

    test_it_throws_error_when_expected_is_array_and_actual_is_object() {
        const r = /assertObjectEqual expects an object for 2nd \(expected\) param/
        this.assertRaisesRegex(Error, r, () => {
            this.assertObjectEqual({}, [])
        })
    }

    test_it_throws_when_toplevel_string_value_is_unequal() {
        const r = /values are not equal under key "name": "bill" !== "bob"/
        this.assertRaisesRegex(Error, r, () => {
            this.assertObjectEqual({name: 'bill'}, {name: 'bob'})
        })
    }

    test_it_throws_when_toplevel_values_of_differing_type() {
        const r = /types are not equal under key "name": number cannot be compared to string/
        this.assertRaisesRegex(Error, r, () => {
            this.assertObjectEqual({name: 1}, {name: 'bob'})
        })
    }
}

unittest.register(AssertObjectEqualTests)

if (require.main === module) {
    unittest.main()
}
