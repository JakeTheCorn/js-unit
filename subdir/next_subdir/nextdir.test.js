const unittest = require('../../unittest')

class SubdirTests extends unittest.TestCase {
    test() {
        this.assertEqual(2, 2)
    }
}

unittest
  .register(
      SubdirTests
  )

if (require.main === module) {
    unittest.main()
}
