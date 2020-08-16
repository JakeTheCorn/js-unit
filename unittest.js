class SkipTestError extends Error {}

class FailCalledError extends Error {}
class FailCalledWithoutReason extends Error {}

class AssertInError extends Error {}
class AssertInArrayError extends Error {}
class AssertInObjectError extends Error {}


class TestCase {
    setUp() {}

    fail(reason) {
        if (!reason) {
            throw new FailCalledWithoutReason('fail(reason: string) cannot be called without reason')
        }
        throw new FailCalledError(reason)
    }

    run() {
        let testsRunCount = 0
        let failureCount = 0
        const failures = []
        let successCount = 0
        let skipCount = 0
        let funcNames = this.__getFuncNames()
        let test
        for (let i = 0; i < funcNames.length; i++) {
            test = funcNames[i]
            if (!/^_?test*/.test(test)) {
                continue
            }
            if (test[0] === '_') {
                skipCount++
                continue
            }
            let instance = new this.constructor()
            instance.setUp()
            try {
                instance[test]()
                successCount++
                testsRunCount++
            } catch (error) {
                failures.push({ test, error })
                failureCount++
                testsRunCount++
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

        return props.filter((e, i, arr) => {
            if (e!=arr[i+1] && typeof self[e] == 'function') return true;
        });
    }

    assertIn(member, container) {
        if (typeof member === 'string' && typeof container === 'string') {
            if (container.indexOf(member) !== -1) return
            throw new AssertInError(member + ' could not be found in ' + container)
        }
        if (Array.isArray(container)) {
            if (container.indexOf(member) !== -1) return
            throw new AssertInArrayError(member + ' could not be found in ' + container)
        }

        if (typeof container === 'object') {
            if (Object.keys(container).indexOf(member) === -1) {
                throw new AssertInObjectError("'" + member + "'" + ' could not be found in ' + JSON.stringify(container))
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
                throw new Error(error.message + ' does not match pattern ' + regex)
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

        for (var i = 0; i < unittest.cases.length; i++) {
            const report = unittest.cases[i].run()
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
            console.info(`
${totalRun} tests run
${successCount} tests pass
${skipCount} tests skipped
${failCount} tests fail

${timingMessage}
            `)
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
module.exports.FailCalledWithoutReason = FailCalledWithoutReason
module.exports.AssertInArrayError = AssertInArrayError
module.exports.AssertInObjectError = AssertInObjectError
