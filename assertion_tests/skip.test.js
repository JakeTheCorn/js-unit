const unittest = require('../unittest')

class SkipTests extends unittest.TestCase {
    _testWithLeadingUnderscore() {
        this.assertEqual('THIS SHOULD NOT RUN', true)
    }
}

unittest.register(SkipTests).run_if_main(module)
