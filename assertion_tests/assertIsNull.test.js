const unittest = require('../unittest')

class IsNullTests extends unittest.TestCase {
    test_pass() {
        this.assertIsNull(null)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /"HEY" is not null/, () => {
            this.assertIsNull('HEY')
        })
    }
}

unittest.register(IsNullTests).run_if_main(module)

