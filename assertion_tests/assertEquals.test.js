const unittest = require("../unittest")

class AssertEqualTests extends unittest.TestCase {
    testNumberEquality() {
        this.assertEqual(1, 1)
    }
}

unittest.register(AssertEqualTests).run_if_main(module)
