const unittest = require("../unittest")

class IsTrueTests extends unittest.TestCase {
    test_pass() {
        this.assertIsTrue(true)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /"HEY" !== true/, () => {
            this.assertIsTrue('HEY')
        })
    }
}

unittest.register(IsTrueTests).run_if_main(module)
