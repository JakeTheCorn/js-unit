const unittest = require('./unittest')


class FlattenObjectTests extends unittest.TestCase {
    test_empty_object() {
        this.assertEqual(1, 2)
    }
}

unittest.register(FlattenObjectTests)

if (require.main === module) {
    unittest.main()
}
