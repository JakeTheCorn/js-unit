const unittest = require('./unittest')
const FailCalledError = require('./unittest').FailCalledError
const AssertInError = require('./unittest').AssertInError
const FailCalledWithoutReason = require('./unittest').FailCalledWithoutReason
const AssertInArrayError = require('./unittest').AssertInArrayError
const AssertInObjectError = require('./unittest').AssertInObjectError

class AssertionError extends Error {}

// use special internal errors for unittest
// Parallel running?
// redo in type script for better type hinting
// assertRaisesRegex should return more helpful text for pattern does not match
// assertRaisesTests should be in their own class

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

    testRaisesRegex() {
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

    testAccess1() {
        this.assertEqual(this.age, 6)
    }

    testAssignment2() {
        this.age = 8
        this.assertEqual(this.age, 8)
    }

    testAccess2() {
        this.assertEqual(this.age, 6)
    }
}

class SkipTestTests extends unittest.TestCase {
    testWithSkipMethod() {
        this.skip()
        this.assertEqual('THIS DOES NOT EXECUTE', true)
    }

    _testWithLeadingUnderscore() {
        this.assertEqual('THIS SHOULD NOT RUN', true)
    }
}

class FailTests extends unittest.TestCase {
    testFailThrowsFailCalledError() {
        this.assertRaises(FailCalledError, () => {
            this.fail('reason is not optional')
        })
    }

    testFailThrowsErrorWithMessage() {
        this.assertRaisesRegex(FailCalledError, /fails/, () => {
            this.fail('fails')
        })
    }

    testFailCannotBeCalledWithoutReason() {
        this.assertRaisesRegex(FailCalledWithoutReason, /fail\(\) cannot be called without reason/, () => {
            this.fail()
        })
    }
}

class AssertInTests extends unittest.TestCase {
    testWithStringPassing() {
        this.assertIn('hello', 'hello world')
    }

    testWithStringFailing() {
        this.assertRaisesRegex(AssertInError, /Hello could not be found in nope/, () => {
            this.assertIn('Hello', 'nope')
        })
    }

    testArrayInFailing() {
        const r = /1 could not be found in [2, 3]/
        this.assertRaisesRegex(AssertInArrayError, r, () => {
            this.assertIn(1, [2, 3])
        })
    }

    testArrayInPassing() {
        this.assertIn(1, [1, 2])
    }

    testJsObjectInFailing() {
        const r = /'name' could not be found in {"age":4}/
        this.assertRaisesRegex(AssertInObjectError, r, () => {
            this.assertIn('name', {age: 4})
        })
    }

    testJsObjectInPassing() {
        this.assertIn('age', {age: 4})
    }
}


unittest
    .register(
        AssertEqualTests,
        OtherTests,
        SetUpAccessTests,
        SetUpAssignmentTests,
        SkipTestTests,
        FailTests,
        AssertInTests,
    )


if (require.main === module) {
    unittest.main()
}
