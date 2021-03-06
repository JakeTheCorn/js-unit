const object_equal = require("./lib/object_equal")

class UnittestError extends Error {}
class AssertDoesNotThrowError extends UnittestError {}

class FailCalledError extends UnittestError {}
class FailCalledWithoutReason extends UnittestError {}

class AssertStringContainsError extends UnittestError {}
class AssertArrayContainsError extends UnittestError {}
class AssertObjectContainsError extends UnittestError {}
class AssertTypeofError extends UnittestError {}
class AssertArrayEqualsError extends UnittestError {}
class DidNotRaiseError extends UnittestError {}


class TestCase {
    setUp() {}

    fail(reason) {
        if (!reason) {
            throw new FailCalledWithoutReason('fail(reason: string) cannot be called without reason')
        }
        throw new FailCalledError(reason)
    }

    run({ only_methods, fail_fast } = {}) {
        let testsRunCount = 0
        let failureCount = 0
        const failures = []
        let successCount = 0
        let skipCount = 0
        let funcNames = this.__getFuncNames(this)
        let onlies = funcNames.filter(v => /^ONLY_test.*$/.test(v))
        if (onlies.length > 0) {
            funcNames = onlies
        }
        let test
        for (let i = 0; i < funcNames.length; i++) {
            test = funcNames[i]
            if (only_methods.length) {
                if (only_methods.indexOf(test) === -1) {
                    continue
                }
            }

            if (!/^_?test*/.test(test)) {
                if (!/^ONLY_test*/.test(test)) {
                    continue
                }
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
                if (fail_fast) {
                    break
                }
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

    __getFuncNames(v) {
        var self = v;
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
            const formatted = typeof subject === 'string' ? `"${subject}"` : subject
            throw new AssertTypeofError(`typeof ${formatted} !== ${type}`)
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
        if (actual !== expected) {
            const formatted_actual = typeof actual === 'string' ? `"${actual}"` : actual
            const formatted_expected = typeof expected === 'string' ? `"${expected}"` : expected
            throw new UnittestError(formatted_actual + ' !== ' + formatted_expected)
        }
    }

    assertIsArray(value) {
        if (!Array.isArray(value)) {
            throw new UnittestError('value is not an array')
        }
    }

    assertHasPath(path, container) {
        if (!container.hasOwnProperty(path)) {
            throw new UnittestError('path "name" could not be found in object')
        }
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
        const err = object_equal(actual, expected)
        if (err) {
            throw new Error(err)
        }
    }

    assertIsNull(actual) {
        if (actual !== null) {
            let formatted_actual = typeof actual === 'string' ? `"${actual}"` : actual
            throw new Error(formatted_actual + ' is not null')
        }
    }

    assertTrue(actual) {
        if (actual !== true) {
            const formatted = typeof actual === 'string' ? `"${actual}"` : actual
            throw new Error(formatted + ' !== true')
        }
    }

    assertFalse(actual) {
        if (actual !== false) {
            const formatted = typeof actual === 'string' ? `"${actual}"` : actual
            throw new Error(formatted + ' !== false')
        }
    }

    async assertAsyncRaises(klass, func) {
        let err = null
        try {
            await func()
        } catch (error) {
            err = error
        }
        if (!err) {
            throw new Error('assertAsyncRaises did not throw')
        }
    }

    assertRegex(value, pattern) {
        if (!pattern.test(value)) {
            throw new Error(`"${value}" does not match pattern ${pattern}`)
        }
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

    assertRaisesRegex(klass, regex, func) {
        if (typeof func !== 'function') {
            throw new TypeError('func arg (3rd position) must be niladic function')
        }
        if (typeof regex !== 'string' && !(regex instanceof RegExp)) {
            throw new TypeError('regex arg (2nd position) must be instance of regex or string')
        }
        try {
            func()
            throw new DidNotRaiseError('assertRaisesRegex fails... function did not throw')
        } catch (error) {
            if (error instanceof DidNotRaiseError) {
                throw new Error(error.message)
            }
            if (error.constructor.name !== klass.name) {
                throw new Error('Did not raise instance of ' + klass.name)
            }
            let r = regex
            if (typeof regex === 'string') {
                r = new RegExp(regex)
            }
            if (!r.test(error.message)) {
                throw new Error(`"${error.message}" does not match pattern: ${r}`)
            }
        }
    }

    assertRuntimeLimit(ms_limit, func) {
        if (typeof ms_limit !== 'number') {
            throw TypeError('assertRuntimeLimit expects a number for 1st parameter')
        }
        if (typeof func !== 'function') {
            throw TypeError('assertRuntimeLimit expects a niladic function for 2nd parameter')
        }
        const start = process.hrtime()
        func()
        const [_end_secs, end_nano_secs] = process.hrtime(start)
        const ONE_MILLION = 1000000
        const func_ms = end_nano_secs / ONE_MILLION
        // what if message says runtime 400ms exceeds 400ms?
        if (func_ms > ms_limit) {
            throw new UnittestError(`function runtime (${Math.trunc(func_ms)}ms) exceeded specified limit (${ms_limit}ms)`)
        }
    }

    assertDatesEqual(actual, expected) {
        const actual_is_date = actual instanceof Date
        const expected_is_date = expected instanceof Date
        if (!actual_is_date || !expected_is_date) {
            throw new UnittestError('Should be called with dates')
        }
    }

    assertDoesNotThrow(func) {
        try {
            if (typeof func !== 'function') {
                throw new UnittestError('function is not callable')
            }
            func()
        } catch (error) {
            throw new AssertDoesNotThrowError('should never throw')
        }
    }

    assertDoesNotThrowInstanceOf(klass, func) {
        try {
            if (typeof func !== 'function') {
                throw new AssertDoesNotThrowError('function is not callable')
            }
            func()
        } catch (error) {
            if (error instanceof klass) {
                throw new AssertDoesNotThrowError(klass.name + ' was thrown unexpectedly')
            }
        }
    }

    assertIsNotNull(value) {
        if (value === null) {
            throw new UnittestError('assertIsNotNull called with null')
        }
    }

    assertLess(actual, expected) {
        if (typeof actual !== 'number' || typeof expected !== 'number') {
            throw new UnittestError('assertLess must be called with numbers')
        }
        if (actual > expected) {
            throw new UnittestError(actual + ' is not less than ' + expected + `. actual > expected`)
        }
        if (actual === expected) {
            throw new UnittestError(actual + ' is not less than ' + expected + `. actual === expected`)
        }
    }

    assertGreater(actual, expected) {
        if (typeof actual !== 'number' || typeof expected !== 'number') {
            throw new UnittestError('assertGreater must be called with numbers')
        }
        if (actual < expected) {
            throw new UnittestError(`${actual} is not greater than ${expected}. actual < expected`)
        }
        if (actual === expected) {
            throw new UnittestError(`${actual} is not greater than ${expected}. actual === expected`)
        }
    }

    assertGreaterEqual(actual, expected) {
        if (typeof actual !== 'number' || typeof expected !== 'number') {
            throw new UnittestError('assertGreaterEqual must be called with numbers')
        }
        if (actual < expected) {
            throw new UnittestError(`${actual} is not greater than or equal to ${expected}. actual < expected`)
        }
    }

    assertLessEqual(actual, expected) {
        if (typeof actual !== 'number' || typeof expected !== 'number') {
            throw new UnittestError('assertLessEqual must be called with numbers')
        }
        if (actual > expected) {
            throw new UnittestError(`${actual} is not less than or equal to ${expected}. actual > expected`)
        }
    }
}

class unittest {
    static TestCase = TestCase
    static cases = []
    static _only_classes = []
    static _only_methods = []
    static _fail_fast = false

    static set_only_classes(classes = []) {
        unittest._only_classes = classes
    }

    static set_only_methods(methods = []) {
        unittest._only_methods = methods
    }

    static set_fail_fast(fail_fast) {
        unittest._fail_fast = fail_fast
    }

    static register(...classes) {
        classes.forEach(cls => {
            const c = new cls()
            unittest.cases.push(c)
        })
        return unittest
    }

    static run_if_main(module) {
        if (!module) {
            throw new UnittestError('run_if_main must receive valid "module" argument')
        }
        if (require.main === module) {
            unittest.main()
        }
    }

    static main() {
        const [startSecs, startNanoSecs] = process.hrtime()
        let successCount = 0
        let failCount = 0
        let totalRun = 0
        let skipCount = 0
        const classFailures = []

        if (unittest._only_classes.length) {
            unittest.cases = unittest.cases.filter(c => {
                const name = c.constructor.name
                if (unittest._only_classes.indexOf(name) > -1) {
                    return true
                }
                return false
            })
        }

        for (var i = 0; i < unittest.cases.length; i++) {
            const report = unittest.cases[i].run({ only_methods: unittest._only_methods, fail_fast: unittest._fail_fast, hooks: unittest._hooks })
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
            print_results({ totalRun, successCount, skipCount, failCount, timingMessage })
        } else {
            const lines = []
            for (const classFailure of classFailures) {
                for (const failure of classFailure.failures) {
                    let line = classFailure.className + '.' + failure.test
                    lines.push([line, failure.error])
                }
            }
            print_results({ totalRun, successCount, skipCount, failCount, timingMessage })
            for (const line of lines) {
                console.log(line[0] + '\n')
                console.log(format_stack(line[1]))
                console.log('\n')
            }
        }
    }
}

function print_results({ totalRun, successCount, skipCount, failCount, timingMessage }) {
    console.info(`
${totalRun} tests run
${successCount} tests pass
${skipCount} tests skipped
${failCount} tests fail

${timingMessage}
`)
}

function format_stack(err) {
    const lines = err.stack.split('\n')
    const res = []
    for (const line of lines) {
        if (/^.*\.run \(.*unittest.js:*/.test(line)) {
            break
        }
        res.push(line)
    }
    return res.join('\n')
}


unittest.errors = {
    UnittestError,
    FailCalledError,
    FailCalledWithoutReason,
    AssertStringContainsError,
    AssertArrayContainsError,
    AssertObjectContainsError,
    AssertTypeofError,
    AssertArrayEqualsError,
}

module.exports = unittest

// todo: print runtime of each test
// print tests while they run
process.on('unhandledRejection', onUnhandledPromiseRejection);

function onUnhandledPromiseRejection(reason, _promise) {
    console.log(reason)
}
