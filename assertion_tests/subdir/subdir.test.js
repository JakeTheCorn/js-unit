const unittest = require('../../unittest')

class SubDirTests extends unittest.TestCase {
    test() {
        this.assertEqual(1, 1)
    }

    _testSkip() {

    }
}

unittest.register(SubDirTests).run_if_main(module)
