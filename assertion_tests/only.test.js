const unittest = require('../unittest')

class OnlyTests extends unittest.TestCase {
    setUp() {
        this.runCounts = {}
    }

    test_this_does_not_run() {
        this.fail('This method should not run since other only method exists')
    }

    ONLY_test_should_run_in_class() {
        this.assertEqual(1, 1)
    }
}

unittest.register(OnlyTests).run_if_main(module)
