const unittest = require('../unittest')
const { AssertStringContainsError } = unittest.errors

class AssertStringContainsTests extends unittest.TestCase {
    testTypeFailure() {
        const r = /assertStringContains must be called with string arguments./
        this.assertRaisesRegex(AssertStringContainsError, r, () => {
            this.assertStringContains('hello', null)
        })
    }

    testValueFailure() {
        const r = /'hello' could not be found in 'world'/
        this.assertRaisesRegex(AssertStringContainsError, r, () => {
            this.assertStringContains('hello', 'world')
        })
    }

    testPass() {
        this.assertStringContains('hello', 'hello world')
    }
}


unittest.register(AssertStringContainsTests).run_if_main(module)
