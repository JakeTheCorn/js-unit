const unittest = require('../unittest')

class Err extends Error {}


class AssertAsyncRaisesTests extends unittest.TestCase {
    async test_pass() {
        await this.assertAsyncRaises(Err, async () => {
            throw new Err()
        })
    }

    async test_does_not_raise_failure() {
        try {
            await this.assertAsyncRaises(Error, async () => {})
            this.fail('function should have thrown')
        } catch (error) {
            // assertRegex would be helpful here
            return this.assertEqual(error.message, 'assertAsyncRaises did not throw')
        }
    }
}

unittest.register(AssertAsyncRaisesTests).run_if_main(module)
