const unittest = require('../unittest')

const {
    FailCalledError,
    FailCalledWithoutReason,
} = unittest.errors


class FailTests extends unittest.TestCase {
    test_throws_FailCalledError() {
        this.assertRaises(FailCalledError, () => {
            this.fail('reason is not optional')
        })
    }

    test_FailThrowsError_message() {
        this.assertRaisesRegex(FailCalledError, /fails/, () => {
            this.fail('fails')
        })
    }

    test_fail_cannot_be_called_without_reason() {
        const r = /fail\(reason: string\) cannot be called without reason/
        this.assertRaisesRegex(FailCalledWithoutReason, r, () => {
            this.fail()
        })
    }
}


unittest.register(FailTests).run_if_main(module)
