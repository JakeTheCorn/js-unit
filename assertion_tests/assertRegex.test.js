const unittest = require("../unittest")


class AssertRegexTests extends unittest.TestCase {
    test_pass() {
        this.assertRegex('hello world', /Hello World/i)
    }

    test_fail() {
        this.assertRaisesRegex(Error, /"my string" does not match pattern */, () => {
            this.assertRegex('my string', /unFound_Pattern/i)
        })
    }
}


unittest.register(AssertRegexTests).run_if_main(module)
