const unittest = require("../unittest")

class Err extends Error {}

class RaisesRegexTests extends unittest.TestCase {
    test_pass() {
        this.assertRaisesRegex(Err, /Hello World/, () => {
            throw new Err('Hello World')
        })
    }
}

unittest.register(RaisesRegexTests).run_if_main(module)
