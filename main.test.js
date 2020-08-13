class AssertionError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

// todo:
//   Parallel running?
//   calling unittest.main() instead of testCaseInstance.run()
//   redo in type script for better type hinting
class TestCase {
    run() {
        //  todo: make this func return so callers can aggregate
        let testsRunCount = 0
        let failureCount = 0
        const failures = []
        let successCount = 0
        const funcNames = this.__getFuncNames().filter(f => /^test*/.test(f))
        for (let funcName of funcNames) {
            try {
                this[funcName]()
                successCount++
            } catch (error) {
                failures.push(error.stack)
                failureCount++
            }
            testsRunCount++
        }
        console.log(`${testsRunCount} Tests Run`)
        console.log(`${successCount} Tests Passed`)
        console.log(`${failureCount} Tests Failed\n`)
        console.log(failures.join('\n'))
    }

    __getFuncNames() {
        var self = this
        var props = [];
        var obj = self;
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));

        return props.filter(function(e, i, arr) {
            if (e!=arr[i+1] && typeof self[e] == 'function') return true;
        });
    }

    assertEqual(actual, expected) {
        if (actual !== expected) {
            throw new Error(actual + ' !== ' + expected)
        }
    }

    assertRaises(errType, throwFunc, args) {
        let err = null
        try {
            if (!(typeof throwFunc !== 'Function')) {
                throw new Error('throw function is not callable')
            }
            throwFunc(args)
        } catch (error) {
            err = error
            if (err instanceof errType) {
                return
            }
        }
        if (!err) {
            throw new Error('did not raise')
        }
        throw new Error('Did not raise instance of ' + errType)
    }
}

class unittest {
    static TestCase = TestCase
    static cases = []
    static registerTestCase(instance) {
        unittest.cases.push(instance)
    }

    static main() {
        for (const testCase of unittest.cases) {
            testCase.run()
        }
    }
}

function register(...classes) {
    classes.forEach(cls => unittest.registerTestCase(new cls()))
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

        this.assertRaises(AssertionError, throwFunc, 1)
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
        this.assertEqual(1, 3)
    }
}

register(AssertEqualTests, OtherTests)

unittest.main()
