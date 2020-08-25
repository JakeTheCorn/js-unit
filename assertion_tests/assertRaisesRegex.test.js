const unittest = require("../unittest")

class RaisesRegexTests extends unittest.TestCase {
    test_pass() {
        class Err extends Error {}

        this.assertRaisesRegex(Err, /Hello World/, () => {
            throw new Err('Hello World')
        })
    }
}

unittest.register(RaisesRegexTests).run_if_main(module)
