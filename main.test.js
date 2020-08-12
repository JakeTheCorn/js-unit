class AssertionError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

class TestCase {
    assertEqual(a, b) {
        if (a !== b) {
            throw new AssertionError('1 !== 2')
        }
    }

    assertRaises(errType, throwFunc) {
        try {
            if (!(typeof throwFunc !== 'function')) {
                throw new TypeError('Shit is fucked')
            }
            throwFunc()
        } catch (error) {
            if (error instanceof errType) {
                return
            }
            throw new AssertionError(error + ' is not an instance of ' + errType)
        }
    }
}

class AssertEqualTests extends TestCase {
    testErrorRaisingNiladic() {
        const niladicThrowFunc = () => {
            throw new AssertionError()
        }
        this.assertRaises(AssertionError, niladicThrowFunc)
    }

    testNumberEquality() {
        this.assertEqual(1, 1)
    }
}

try {
    const tests = new AssertEqualTests()
    tests.testErrorRaisingNiladic()
    tests.testNumberEquality()
} catch (error) {
    assert(error.message, '1 !== 2')
}
console.log('all tests pass')

function assert(a, b, msg = null) {
    if (a !== b) {
        throw new AssertionError(`${a} !== ${b}`, msg ? msg : '')
    }
}
