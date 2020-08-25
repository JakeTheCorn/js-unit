const unittest = require('../unittest')

class IsNullTests extends unittest.TestCase {
    testPass() {
        this.assertIsNull(null)
    }

    testFail() {
        this.assertRaisesRegex(Error, /"HEY" is not null/, () => {
            this.assertIsNull('HEY')
        })
    }
}

unittest.register(IsNullTests).run_if_main(module)

