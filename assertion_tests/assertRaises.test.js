const unittest = require("../unittest")

class Err extends Error {}

class AssertRaisesTests extends unittest.TestCase {
    test_pass() {
        this.assertRaises(Err, () => {
            throw new Err()
        })
    }
}

unittest.register(AssertRaisesTests).run_if_main(module)
