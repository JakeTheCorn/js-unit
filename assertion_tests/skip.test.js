const unittest = require('../unittest')

class SkipTests extends unittest.TestCase {
    _test_with_leading_underscore() {
        this.assertEqual('THIS SHOULD NOT RUN', true)
    }
}

unittest.register(SkipTests).run_if_main(module)
