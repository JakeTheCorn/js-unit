class DateTime {
    constructor(date) {
        this.date = date
        this.__throw_for_invalid_fields()
    }

    /*
    compare(other) {
        return DateTimeComparison(this, other)
    }
    */

    years_equal(other) {
        if (!(other instanceof DateTime)) {
            throw new TypeError('years_equal must be called with instance of DateTime')
        }
        const other_full_year = other.date.getFullYear()
        const this_full_year = this.date.getFullYear()

        return other_full_year === this_full_year
    }

    __throw_for_invalid_fields() {
        if (!(this.date instanceof Date)) {
            throw new TypeError()
        }
    }
}

module.exports = DateTime
