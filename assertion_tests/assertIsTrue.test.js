const unittest = require("../unittest")

class IsTrueTests extends unittest.TestCase {
    test_pass() {
        this.assertTrue(true)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /"HEY" !== true/, () => {
            this.assertTrue('HEY')
        })
    }
}

unittest.register(IsTrueTests).run_if_main(module)
