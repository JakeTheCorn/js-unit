class AssertionError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

// todo:
//   Error Reporting
//     Display results in comparison.
//     Make assert functions return values instead of throwing
//       this will be useful for reporting
//       this runner of this can still throw.
//   Parallel running?
//   calling unittest.main() instead of testCaseInstance.run()


class TestCase {
    run() {
        const results = {}
        let testsRunCount = 0
        let failureCount = 0
        let successCount = 0
        const funcNames = this.__getFuncNames().filter(f => /^test*/.test(f))
        for (let funcName of funcNames) {
            try {
                this[funcName]()
                results[funcName] = true
                successCount++
            } catch (error) {
                results[funcName] = false
                failureCount++
            }
            testsRunCount++
        }
        console.log(`${testsRunCount} Tests Run`)
        console.log(`${successCount} Tests Passed`)
        console.log(`${failureCount} Tests Failed`)
    }

    __getFuncNames() {
        var self = this
        var props = [];
        var obj = self;
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));

        return props.sort().filter(function(e, i, arr) {
            if (e!=arr[i+1] && typeof self[e] == 'function') return true;
        });

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

    testOnePlusOne() {
        this.assertEqual(1 + 1, 2)
    }
}


new AssertEqualTests().run()


// this is an untested function
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
