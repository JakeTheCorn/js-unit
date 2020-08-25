const unittest = require('../../unittest')

class SubDirTests extends unittest.TestCase {
    test() {
        this.assertEqual(4, 4)
    }
}

unittest.register(SubDirTests).run_if_main(module)
