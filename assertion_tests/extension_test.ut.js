const unittest = require('../unittest')

class SubdirTests extends unittest.TestCase {
    test() {
        this.assertEqual(7, 7)
    }
}

unittest.register(SubdirTests).run_if_main(module)
