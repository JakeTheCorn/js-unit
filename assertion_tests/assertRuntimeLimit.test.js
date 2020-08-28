const unittest = require("../unittest")
const { UnittestError } = unittest.errors


class AssertRuntimeLimitTests extends unittest.TestCase {
    test_TypeError_thrown_when_non_number_1st_param() {
        const r = /assertRuntimeLimit expects a number for 1st parameter/
        this.assertRaisesRegex(TypeError, r, () => {
            this.assertRuntimeLimit('', noop)
        })
    }

    test_TypeError_thrown_when_non_function_2nd_param() {
        const r = /assertRuntimeLimit expects a niladic function for 2nd parameter/
        this.assertRaisesRegex(TypeError, r, () => {
            this.assertRuntimeLimit(2, null)
        })
    }

    test_too_long() {
        const r = /function runtime \(\d+ms\) exceeded specified limit \(1ms\)/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertRuntimeLimit(1, () => {
                sleep(2)
            })
        })
    }

    test_pass() {
        this.assertRuntimeLimit(1000, noop)
    }
}

function noop() {}

// todo: print runtime of each test

// todo: move to utils
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


unittest.register(AssertRuntimeLimitTests).run_if_main(module)
