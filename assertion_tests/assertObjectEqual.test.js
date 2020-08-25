const unittest = require('../unittest')

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
}

unittest.register(AssertObjectEqualTests)

if (require.main === module) {
    unittest.main()
}
