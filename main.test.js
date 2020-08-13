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
        for (let test of funcNames) {
            try {
                this[test]()
                successCount++
            } catch (error) {
                failures.push({ test, error })
                failureCount++
            }
            testsRunCount++
        }
        const counts = {
            run: testsRunCount,
            success: successCount,
            failed: failureCount,
        }

        return {
            name: this.constructor.name,
            counts,
            failures,
        }
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
        let successCount = 0
        let failCount = 0
        let totalRun = 0
        const classFailures = []
        for (const testCase of unittest.cases) {
            const report = testCase.run()
            totalRun += report.counts.run
            successCount += report.counts.success
            failCount += report.counts.failed
            if (report.counts.failed) {
                classFailures.push({
                    className: report.name,
                    failures: report.failures,
                })
            }
        }
        if (failCount === 0) {
            console.log(totalRun + ' tests run')
            console.log(successCount + ' tests pass')
            console.log(failCount + ' tests fail')
            return
        }
        const lines = []
        for (const classFailure of classFailures) {
            for (const failure of classFailure.failures) {
                let line = classFailure.className + '.' + failure.test
                lines.push([line, failure.error])
            }
        }
        for (const line of lines) {
            console.log(line[0])
            console.log(line[1])
            console.log('\n')
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
        this.assertEqual(1, 1)
    }
}

register(AssertEqualTests, OtherTests)

unittest.main()
