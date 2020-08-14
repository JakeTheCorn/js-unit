const unittest = require('./unittest')


class AssertionError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}


class AssertEqualTests extends unittest.TestCase {
    testErrorRaisingNiladic() {
        this.assertRaises(AssertionError, () => {
            throw new AssertionError()
        })
    }

    testErrorRaisingMonadic() {
        const throwFunc = a => {
            if (a === 1) {
                throw new AssertionError('A EQUALS ONE!')
            }
        }

        this.assertRaises(AssertionError, () => {
            throwFunc(1)
        })
    }

    testFailsWhenDoesNotRaise() {
        this.assertRaises(AssertionError, () => {
            throw new AssertionError()
        })
    }

    testNumberEquality() {
        this.assertEqual(1, 1)
    }

    testNumberInEqualityRaises() {
        this.assertEqual(1, 1)
    }

    testOnePlusOne() {
        this.assertEqual(1 + 1, 2)
    }
}

class OtherTests extends unittest.TestCase {
    testOtherStuff() {
        this.assertEqual(null, null)
    }

    testIsNull() {
        this.assertIsNull(null)
    }

    testIsTrue() {
        this.assertIsTrue(true)
    }

    testIsFalse() {
        this.assertIsFalse(false)
    }

    testAssertRaisesRegex() {
        this.assertRaisesRegex(AssertionError, /Hello World/, () => {
            throw new AssertionError('Hello World')
        })
    }
}

class SetUpAccessTests extends unittest.TestCase {
    setUp() {
        this.age = 6
    }

    testAccess() {
        this.assertEqual(this.age, 6)
    }
}

class SetUpAssignmentTests extends unittest.TestCase {
    setUp() {
        this.age = 6
    }

    testAssignment1() {
        this.age = 7
        this.assertEqual(this.age, 7)
    }

    testAssignment2() {
        this.age = 8
        this.assertEqual(this.age, 8)
    }

    testAccess() {
        this.assertEqual(this.age, 6)
    }
}


unittest
    .register(
        AssertEqualTests,
        OtherTests,
        SetUpAccessTests,
        SetUpAssignmentTests
    )


if (require.main === module) {
    unittest.main()
}
