const unittest = require('../unittest')
const {
    FailCalledError,
    FailCalledWithoutReason,
    AssertStringContainsError,
    AssertArrayContainsError,
    AssertTypeofError,
    AssertArrayEqualsError
} = unittest.errors

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
    testPass() {
        class Err extends Error {}

        this.assertRaises(Err, () => {
            throw new Err()
        })
    }
}

class RaisesRegexTests extends unittest.TestCase {
    testPass() {
        class Err extends Error {}

        this.assertRaisesRegex(Err, /Hello World/, () => {
            throw new Err('Hello World')
        })
    }
}


class IsNullTests extends unittest.TestCase {
    testPass() {
        this.assertIsNull(null)
    }

    testFail() {
        this.assertRaisesRegex(Error, /HEY !== null/, () => {
            this.assertIsNull('HEY')
        })
    }
}


class IsTrueTests extends unittest.TestCase {
    testPass() {
        this.assertIsTrue(true)
    }

    testFail() {
        this.assertRaisesRegex(Error, /HEY !== true/, () => {
            this.assertIsTrue('HEY')
        })
    }
}


class IsFalseTests extends unittest.TestCase {
    testPass() {
        this.assertIsFalse(false)
    }

    testFail() {
        this.assertRaisesRegex(Error, /true !== false/, () => {
            this.assertIsFalse(true)
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


unittest
    .register(
        AssertEqualTests,
        AssertRaisesTests,
        RaisesRegexTests,
        SetUpAssignmentTests,
        SkipTestTests,
        FailTests,
        AssertStringContainsTests,
        AssertArrayContainsTests,
        AssertTypeofTests,
        AssertArrayEqualsTests,
        IsFalseTests,
        IsTrueTests,
        IsNullTests,
    )


if (require.main === module) {
    unittest.main()
}
