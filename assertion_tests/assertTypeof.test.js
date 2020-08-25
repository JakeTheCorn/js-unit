const unittest = require("../unittest")
const { AssertTypeofError } = unittest.errors

class AssertTypeofTests extends unittest.TestCase {
    test_failure() {
        const r = /typeof hello !== function/
        this.assertRaisesRegex(AssertTypeofError, r, () => {
            this.assertTypeof('hello', 'function')
        })
    }

    test_pass() {
        this.assertTypeof('hello', 'string')
    }
}

unittest.register(AssertTypeofTests).run_if_main(module)
