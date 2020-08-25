const unittest = require('../../unittest')

class SubdirTests extends unittest.TestCase {
    test() {
        this.assertEqual(1, 1)
    }

    _testSkip() {

    }
}

unittest
  .register(
      SubdirTests
  )

if (require.main === module) {
    unittest.main()
}
