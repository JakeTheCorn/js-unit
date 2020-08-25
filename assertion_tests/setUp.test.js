const unittest = require('../unittest')

class SetUpAssignmentTests extends unittest.TestCase {
    setUp() {
        this.age = 6
    }

    test_assignment_1() {
        this.age = 7
        this.assertEqual(this.age, 7)
    }

    test_access1() {
        this.assertEqual(this.age, 6)
    }

    test_assignment2() {
        this.age = 8
        this.assertEqual(this.age, 8)
    }

    test_access2() {
        this.assertEqual(this.age, 6)
    }
}

unittest.register(SetUpAssignmentTests).run_if_main(module)
