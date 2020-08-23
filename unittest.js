class FailCalledError extends Error {}
class FailCalledWithoutReason extends Error {}

class AssertStringContainsError extends Error {}
class AssertArrayContainsError extends Error {}
class AssertObjectContainsError extends Error {}
class AssertTypeofError extends Error {}
class AssertArrayEqualsError extends Error {}


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

    assertTypeof(subject, type) {
        if (typeof subject !== type) {
            throw new AssertTypeofError(`typeof ${subject} !== ${type}`)
        }
    }

    assertArrayEquals(actual, expected) {
        if (!Array.isArray(actual) || !Array.isArray(expected)) {
            throw new AssertArrayEqualsError('assertArrayEquals takes two array arguments.')
        }

        for (let i = 0; i < actual.length; i++) {
            if (actual[i] !== expected[i]) {
                let msg = 'arrays not equal. First differing element found at index ' + i
                throw new AssertArrayEqualsError(msg)
            }
        }
    }


    assertStringContains(member, container) {
        let m_type = typeof member
        let c_type = typeof container
        if (c_type !== 'string' || m_type !== 'string') {
            throw new AssertStringContainsError('assertStringContains must be called with string arguments.')
        }
        if (container.indexOf(member) !== -1) return
        throw new AssertStringContainsError(`'${member}' could not be found in '${container}'`)
    }

    assertArrayContains(member, container) {
        if (!Array.isArray(container)) {
            throw new AssertArrayContainsError('container arg must be an instance of Array')
        }
        if (container.length === 0) {
            throw new AssertArrayContainsError('container arg must not be empty Array')
        }
        if (container.indexOf(member) !== -1) return
        throw new AssertArrayContainsError(`${member} could not be found in [${container}]`)
    }

    assertEqual(actual, expected) {
        if (actual !== expected)
            throw new Error(actual + ' !== ' + expected)
    }

    assertObjectEqual(actual, expected) {
        if (typeof expected !== 'object') {
            throw new Error('assertObjectEqual expects an object for 2nd (expected) param')
        }
        if (typeof actual !== 'object') {
            throw new Error('assertObjectEqual expects an object for 1st (actual) param')
        }
        if (Array.isArray(actual)) {
            throw new Error('assertObjectEqual expects an object for 1st (actual) param')
        }
        if (Array.isArray(expected)) {
            throw new Error('assertObjectEqual expects an object for 2nd (expected) param')
        }
        this.__assertObjectEqual(actual, expected)
    }

    __assertObjectEqual(actual, expected) {
        // value equality, object values
        const a_copy = {...actual}
        for (let key in expected) {
            if (actual.hasOwnProperty(key)) {
                const a_val = actual[key]; const e_val = expected[key];
                const types = get_types(a_val, e_val)
                if (types.actual !== types.expected) {
                    let msg = `types are not equal under key "${key}": ${types.actual} cannot be compared to ${types.expected}`
                    throw new Error(msg)
                }
                if (a_val !== e_val) {
                    throw new Error(`values are not equal under key "${key}": "${a_val}" !== "${e_val}"`)
                }
                continue;
            }
            throw new Error(`actual missing ${key}`)
        }

        function get_types(actual_val, expected_val) {
            return {
                actual: typeof actual_val,
                expected: typeof expected_val
            }
        }

        function compare_string_values(actual, expected, key) {
            if (actual !== expected) {
                throw new Error(`values are not equal under key "${key}": "${a_val}" !== "${e_val}"`)
            }
        }
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
            if (typeof throwFunc !== 'function') {
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

unittest.errors = {
    FailCalledError,
    FailCalledWithoutReason,
    AssertStringContainsError,
    AssertArrayContainsError,
    AssertObjectContainsError,
    AssertTypeofError,
    AssertArrayEqualsError
}

module.exports = unittest
