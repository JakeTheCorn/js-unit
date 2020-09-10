const unittest = require('../unittest')


class One extends unittest.TestCase {
    test_this_one() {}

    test_not_this_one() {
        this.fail('THIS METHOD SHOULD NOT RUN')
    }
}

class Two extends unittest.TestCase {
    test_this_one() {}

    test_this_one_too() {}

    test_not_this_one() {
        this.fail('THIS METHOD SHOULD NOT RUN')
    }
}


unittest.register(One, Two).run_if_main(module)
