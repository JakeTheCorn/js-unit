const unittest = require("../unittest")
const { UnittestError } = unittest.errors


class AssertRuntimeTests extends unittest.TestCase {
    test_too_long() {
        const r = /function runtime \(\d+ms\) exceeded specified limit \(1ms\)/
        this.assertRaisesRegex(UnittestError, r, () => {
            this.assertRuntimeLimit(1, () => {
                sleep(2)
            })
        })
    }

    test_pass() {
        this.assertRuntimeLimit(100, noop)
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


unittest.register(AssertRuntimeTests).run_if_main(module)
