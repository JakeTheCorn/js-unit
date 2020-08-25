const unittest = require("../unittest")

class AssertRaisesTests extends unittest.TestCase {
    testPass() {
        class Err extends Error {}

        this.assertRaises(Err, () => {
            throw new Err()
        })
    }
}

unittest.register(AssertRaisesTests).run_if_main(module)
