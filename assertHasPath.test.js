const unittest = require('./unittest')


class AssertHasPathTests extends unittest.TestCase {
    test_flat_success() {
        this.assertHasPath('name', {name: 'Hector'})
    }

    test_flat_failure() {
        const r = /path "name" could not be found in object/
        this.assertRaisesRegex(Error, r, () => {
            this.assertHasPath('name', {})
        })
    }
}

unittest.register(AssertHasPathTests)

if (require.main === module) {
    unittest.main()
}
