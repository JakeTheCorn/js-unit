
// todo:
//   Parallel running?
//   redo in type script for better type hinting

class TestCase {
    setUp() {}

    run() {
        let testsRunCount = 0
        let failureCount = 0
        const failures = []
        let successCount = 0
        const funcNames = this.__getFuncNames()
        for (let test of funcNames) {
            if (!/^test*/.test(test)) {
                continue
            }
            const instance = new this.constructor()
            instance.setUp()
            try {
                instance[test]()
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
        // use framework to test this function
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
        if (actual !== expected)
            throw new Error(actual + ' !== ' + expected)
    }

    assertIsNull(actual) {
        if (actual !== null)
            throw new Error(actual + ' !== null')
    }

    assertIsTrue(actual) {
        if (actual !== true)
            throw new Error(actual + ' !== true')
    }

    assertIsFalse(actual) {
        if (actual !== false)
            throw new Error(actual + ' !== false')
    }

    assertRaises(errType, throwFunc) {
        let err = null
        try {
            if (!(typeof throwFunc !== 'Function')) {
                throw new Error('throw function is not callable')
            }
            throwFunc()
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

    assertRaisesRegex(klass, regex, throwFunc) {
        class DidNotRaiseError extends Error {}

        try {
            throwFunc()
            throw new DidNotRaiseError('assertRaisesRegex fails... function did now throw')
        } catch (error) {
            if (error instanceof DidNotRaiseError) {
                throw new Error(error.message)
            }
            if (error.constructor.name !== klass.name) {
                throw new Error('Did not raise instance of ' + klass.name)
            }
            if (!regex.test(error.message)) {
                throw new Error('error message did not match pattern ' + regex)
            }
        }
    }
}

class unittest {
    static TestCase = TestCase
    static cases = []
    static register(...classes) {
        classes.forEach(cls => {
            const c = new cls()
            unittest.cases.push(c)
        })
        return unittest
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

module.exports = unittest
