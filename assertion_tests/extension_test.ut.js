const unittest = require('../unittest')

class SubdirTests extends unittest.TestCase {
    test() {
        this.assertEqual(7, 7)
    }
}

unittest
  .register(
      SubdirTests
  )

if (require.main === module) {
    unittest.main()
}
