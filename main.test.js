const unittest = require('./unittest')
const FailCalledError = require('./unittest').FailCalledError
const AssertInError = require('./unittest').AssertInError
const FailCalledWithoutReason = require('./unittest').FailCalledWithoutReason
const AssertInArrayError = require('./unittest').AssertInArrayError
const AssertInObjectError = require('./unittest').AssertInObjectError
const AssertStringContainsError = require('./unittest').AssertStringContainsError
const AssertArrayContainsError = require('./unittest').AssertArrayContainsError
const AssertObjectContainsError = require('./unittest').AssertObjectContainsError

class AssertionError extends Error {}

// use special internal errors for unittest
// Parallel running?
// redo in type script for better type hinting

class AssertEqualTests extends unittest.TestCase {
    testNumberEquality() {
        this.assertEqual(1, 1)
    }
}

class AssertStringContainsTests extends unittest.TestCase {
    testTypeFailure() {
        const r = /assertStringContains must be called with string arguments./
        this.assertRaisesRegex(AssertStringContainsError, r, () => {
            this.assertStringContains('hello', null)
        })
    }

    testValueFailure() {
        const r = /'hello' could not be found in 'world'/
        this.assertRaisesRegex(AssertStringContainsError, r, () => {
            this.assertStringContains('hello', 'world')
        })
    }

    testPass() {
        this.assertStringContains('hello', 'hello world')
    }

}

class AssertArrayContainsTests extends unittest.TestCase {
    testTypeFailure() {
        const r = /container arg must be an instance of Array/
        this.assertRaisesRegex(AssertArrayContainsError, r, () => {
            this.assertArrayContains(1, null)
        })
    }

    testEmptyContainer() {
        const r = /container arg must not be empty Array/
        this.assertRaisesRegex(AssertArrayContainsError, r, () => {
            this.assertArrayContains(1, [])
        })
    }

    testValueFailure() {
        const r = /1 could not be found in \[2,3]/
        this.assertRaisesRegex(AssertArrayContainsError, r, () => {
            this.assertArrayContains(1, [2, 3])
        })
    }

    testPass() {
        this.assertArrayContains(1, [1, 2])
    }
}


class AssertObjectContainsTests extends unittest.TestCase {
    testTypeFailure() {
        const r = /container arg must be an instance of object/
        this.assertRaisesRegex(AssertObjectContainsError, r, () => {
            this.assertObjectContains(1, null)
        })
    }
}


class AssertRaisesTests extends unittest.TestCase {
    testErrorRaisingNiladic() {
        this.assertRaises(AssertionError, () => {
            throw new AssertionError()
        })
    }

    testFailsWhenDoesNotRaise() {
        this.assertRaises(AssertionError, () => {
            throw new AssertionError()
        })
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
        const r = /fail\(reason: string\) cannot be called without reason/
        this.assertRaisesRegex(FailCalledWithoutReason, r, () => {
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
        AssertRaisesTests,
        OtherTests,
        SetUpAssignmentTests,
        SkipTestTests,
        FailTests,
        AssertInTests,
        AssertStringContainsTests,
        AssertArrayContainsTests,
        AssertObjectContainsTests
    )


if (require.main === module) {
    unittest.main()
}
