const unittest = require("../unittest")
const { AssertArrayContainsError } = unittest.errors


class AssertArrayContainsTests extends unittest.TestCase {
    testTypeFailure() {
        const r = /container arg must be an instance of Array/
        this.assertRaisesRegex(AssertArrayContainsError, r, () => {
            this.assertArrayContains(1, null)
        })
    }

    testEmptyContainer() {
        const r = /container arg must not be empty Array/
        this.assertRaisesRegex(AssertArrayContainsError, r, () => {
            this.assertArrayContains(1, [])
        })
    }

    testValueFailure() {
        const r = /1 could not be found in \[2,3]/
        this.assertRaisesRegex(AssertArrayContainsError, r, () => {
            this.assertArrayContains(1, [2, 3])
        })
    }

    testPass() {
        this.assertArrayContains(1, [1, 2])
    }
}


unittest.register(AssertArrayContainsTests).run_if_main(module)
