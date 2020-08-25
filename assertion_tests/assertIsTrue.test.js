const unittest = require("../unittest")

class IsTrueTests extends unittest.TestCase {
    testPass() {
        this.assertIsTrue(true)
    }

    testFail() {
        this.assertRaisesRegex(Error, /HEY !== true/, () => {
            this.assertIsTrue('HEY')
        })
    }
}

unittest.register(IsTrueTests).run_if_main(module)
