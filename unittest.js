class SkipTestError extends Error {}

class FailCalledError extends Error {}

class AssertInError extends Error {}


class TestCase {
    setUp() {}

    fail(reason) {
        throw new FailCalledError(reason)
    }

    skip(reason='') {
        throw new SkipTestError(reason)
    }

    run() {
        let testsRunCount = 0
        let failureCount = 0
        const failures = []
        let successCount = 0
        let skipCount = 0
        const funcNames = this.__getFuncNames()
        for (let test of funcNames) {
            if (!/^_?test*/.test(test)) {
                continue
            }
            if (test[0] === '_') {
                skipCount++
                continue
            }
            const instance = new this.constructor()
            instance.setUp()
            try {
                instance[test]()
                successCount++
                testsRunCount++
            } catch (error) {
                if (error instanceof SkipTestError) {
                    skipCount++
                } else { // else is a code smell
                    failures.push({ test, error })
                    failureCount++
                    testsRunCount++
                }
            }

        }
        const counts = {
            run: testsRunCount,
            success: successCount,
            failed: failureCount,
            skipped: skipCount,
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

    assertIn(member, container) {
        if (typeof member === 'string' && typeof container === 'string') {
            if (container.indexOf(member) === -1) {
                throw new AssertInError(member + ' could not be found in ' + container)
            }
        }
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
        const [startSecs, startNanoSecs] = process.hrtime()
        let successCount = 0
        let failCount = 0
        let totalRun = 0
        let skipCount = 0
        const classFailures = []

        for (const testCase of unittest.cases) {
            const report = testCase.run()
            totalRun += report.counts.run
            successCount += report.counts.success
            failCount += report.counts.failed
            skipCount += report.counts.skipped
            if (report.counts.failed) {
                classFailures.push({
                    className: report.name,
                    failures: report.failures,
                })
            }
        }
        const [endSecs, endNanoSecs] = process.hrtime()

        const timingMessage = `Test ran in ${endSecs - startSecs}s ${(endNanoSecs - startNanoSecs) / 1000000}ms`


        if (failCount === 0) {
            console.log(totalRun + ' tests run')
            console.log(successCount + ' tests pass')
            skipCount && console.log(skipCount + ' tests skipped')
            console.log(failCount + ' tests fail\n')

            console.info(timingMessage)
            return
        }
        const lines = []
        for (const classFailure of classFailures) {
            for (const failure of classFailure.failures) {
                let line = classFailure.className + '.' + failure.test
                lines.push([line, failure.error])
            }
        }
        console.info(timingMessage)
        for (const line of lines) {
            console.log(line[0])
            console.log(line[1])
            console.log('\n')
        }

    }
}

module.exports = unittest
module.exports.FailCalledError = FailCalledError
module.exports.AssertInError = AssertInError
