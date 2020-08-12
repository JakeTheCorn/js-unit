class AssertionError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

class TestCase {
    assertEqual(a, b) {
        if (a !== b) {
            throw new AssertionError(a + ' !== ' + b)
        }
    }

    assertRaises(errType, throwFunc) {
        try {
            if (!(typeof throwFunc !== 'Function')) {
                throw new TypeError('throwFunc must be callable')
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

const tests = new AssertEqualTests()
tests.testErrorRaisingNiladic()
tests.testNumberEquality()
console.log('all tests pass')

// function assert(a, b, msg = null) {
//     if (a !== b) {
//         throw new AssertionError(`${a} !== ${b}`, msg ? msg : '')
//     }
// }
