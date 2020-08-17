const unittest = require('./unittest')
const {
    FailCalledError,
    FailCalledWithoutReason,
    AssertStringContainsError,
    AssertArrayContainsError,
    AssertTypeofError,
    AssertArrayEqualsError
} = unittest.errors

class AssertionError extends Error {}

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


class AssertTypeofTests extends unittest.TestCase {
    testFailure() {
        const r = /typeof hello !== function/
        this.assertRaisesRegex(AssertTypeofError, r, () => {
            this.assertTypeof('hello', 'function')
        })
    }

    testPass() {
        this.assertTypeof('hello', 'string')
    }
}


class AssertArrayEqualsTests extends unittest.TestCase {
    testTypeFailure() {
        const r = /assertArrayEquals takes two array arguments./
        this.assertRaisesRegex(AssertArrayEqualsError, r, () => {
            this.assertArrayEquals(null, undefined)
        })
    }

    testFailure() {
        const r = /arrays not equal. First differing element found at index 0/
        this.assertRaisesRegex(AssertArrayEqualsError, r, () => {
            this.assertArrayEquals([1], [2])
        })
    }

    testPass() {
        this.assertArrayEquals([1], [1])
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

// class IsFalseTests extends unittest.TestCase {

// }


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


unittest
    .register(
        AssertEqualTests,
        AssertRaisesTests,
        OtherTests,
        SetUpAssignmentTests,
        SkipTestTests,
        FailTests,
        AssertStringContainsTests,
        AssertArrayContainsTests,
        AssertTypeofTests,
        AssertArrayEqualsTests
    )


if (require.main === module) {
    unittest.main()
}
