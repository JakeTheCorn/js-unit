const unittest = require('../unittest')


class DateTime {
    constructor(date) {
        this.date = date
        this.__throw_for_invalid_fields()
    }

    __throw_for_invalid_fields() {
        if (!(this.date instanceof Date)) {
            throw new TypeError()
        }
    }
}


class DateTimeTests extends unittest.TestCase {
    test_it_cannot_be_constructed_without_constructor_args() {
        this.assertRaises(TypeError, () => {
            const dt = new DateTime()
        })
    }

    test_it_can_be_constructed_with_date() {
        new DateTime(new Date())
    }
}


unittest.register(DateTimeTests).run_if_main(module)
