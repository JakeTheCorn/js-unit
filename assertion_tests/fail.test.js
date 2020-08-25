const unittest = require('../unittest')

const {
    FailCalledError,
    FailCalledWithoutReason,
} = unittest.errors


class FailTests extends unittest.TestCase {
    testFailThrowsFailCalledError() {
        this.assertRaises(FailCalledError, () => {
            this.fail('reason is not optional')
        })
    }

    testFailThrowsErrorWithMessage() {
        this.assertRaisesRegex(FailCalledError, /fails/, () => {
            this.fail('fails')
        })
    }

    testFailCannotBeCalledWithoutReason() {
        const r = /fail\(reason: string\) cannot be called without reason/
        this.assertRaisesRegex(FailCalledWithoutReason, r, () => {
            this.fail()
        })
    }
}


unittest.register(FailTests).run_if_main(module)
