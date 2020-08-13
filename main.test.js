class AssertionError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

function getAllFuncs(toCheck) {
    var props = [];
    var obj = toCheck;
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) {
       if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
    });
}

class TestCase {
    run() {
        const results = {}
        const funcNames = getAllFuncs(this).filter(f => /^test*/.test(f))
        for (let funcName of funcNames) {
            try {
                this[funcName]()
                results[funcName] = true
            } catch (error) {
                results[funcName] = false
            }
        }
        console.log(results)
    }

    assertEqual(a, b) {
        if (a !== b) {
            throw new AssertionError(a + ' !== ' + b)
        }
    }

    assertRaises(errType, throwFunc, args) {
        let err = null
        try {
            if (!(typeof throwFunc !== 'Function')) {
                throw new TypeError('throwFunc must be callable')
            }
            throwFunc(args)
        } catch (error) {
            err = error
        }
        if (!err) {
            throw new Error(throwFunc + ' did not throw')
        }
        if (err instanceof errType) {
            return
        }
        throw new AssertionError(error + ' is not an instance of ' + errType)
    }
}

class AssertEqualTests extends TestCase {
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

        this.assertRaises(AssertionError, throwFunc, 1)
    }

    testFailsWhenDoesNotRaise() {
        this.assertRaises(AssertionError, () => {})
    }

    testNumberEquality() {
        this.assertEqual(1, 1)
    }

    testNumberInEqualityRaises() {
        this.assertEqual(1, 2)
    }
}

const tests = new AssertEqualTests()
// tests.testErrorRaisingNiladic()
// tests.testErrorRaisingMonadic()
// tests.testNumberInEqualityRaises()

tests.run()
// try {

//     tests.testFailsWhenDoesNotRaise()
//     console.log('Failure! assertRaises did not raise')
// } catch (error) {}

// tests.testNumberEquality()
console.log('all tests pass')

