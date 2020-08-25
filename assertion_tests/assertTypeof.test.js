const unittest = require("../unittest")
const { AssertTypeofError } = unittest.errors

class AssertTypeofTests extends unittest.TestCase {
    testFailure() {
        const r = /typeof hello !== function/
        this.assertRaisesRegex(AssertTypeofError, r, () => {
            this.assertTypeof('hello', 'function')
        })
    }

    testPass() {
        this.assertTypeof('hello', 'string')
    }
}

unittest.register(AssertTypeofTests).run_if_main(module)
