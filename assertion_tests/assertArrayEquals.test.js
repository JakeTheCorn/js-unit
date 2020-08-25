const unittest = require("../unittest")
const { AssertArrayEqualsError } = unittest.errors

class AssertArrayEqualsTests extends unittest.TestCase {
    test_type_failure() {
        const r = /assertArrayEquals takes two array arguments./
        this.assertRaisesRegex(AssertArrayEqualsError, r, () => {
            this.assertArrayEquals(null, undefined)
        })
    }

    test_failure() {
        const r = /arrays not equal. First differing element found at index 0/
        this.assertRaisesRegex(AssertArrayEqualsError, r, () => {
            this.assertArrayEquals([1], [2])
        })
    }

    test_pass() {
        this.assertArrayEquals([1], [1])
    }
}

unittest.register(AssertArrayEqualsTests).run_if_main(module)
