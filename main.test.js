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

unittest.register(AssertEqualTests, OtherTests)

unittest.main()
