const unittest = require('../unittest')
const DateTime = require('../lib/datetime')


class DateTimeTests extends unittest.TestCase {
    test_it_can_be_constructed_with_date() {
        new DateTime(new Date())
    }

    test_it_cannot_be_constructed_without_date() {
        this.assertRaises(TypeError, () => {
            new DateTime('')
        })
    }

    test_years_equal_pass() {
        const year2020 = 2020
        const d1 = new Date()
        const d2 = new Date()
        d1.setFullYear(year2020)
        d2.setFullYear(year2020)
        const dt = new DateTime(d1)
        const dt2 = new DateTime(d2)

        const years_equal = dt.years_equal(dt2)
        this.assertIsTrue(years_equal)
    }

    test_years_equal_TypeError_thrown() {
        this.assertRaises(TypeError, () => {
            const year2020 = 2020
            const date1 = new Date(year2020)
            const dt = new DateTime(date1)
            dt.years_equal('')
        })
    }

    test_years_equal_returns_false_when_years_not_equal() {
        const year2020 = 2020
        const year2021 = 2021
        const d1 = new Date()
        const d2 = new Date()
        d1.setFullYear(year2020)
        d2.setFullYear(year2021)
        const dt1 = new DateTime(d1)
        const dt2 = new DateTime(d2)

        const years_equal = dt1.years_equal(dt2)
        this.assertIsFalse(years_equal)
    }
}


unittest.register(DateTimeTests).run_if_main(module)

/*
class TableTestCase extends unittest.TestCase {

    items = []

    assert(item) {
        this.
    }
}

*/
