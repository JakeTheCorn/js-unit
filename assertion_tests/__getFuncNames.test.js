const unittest = require('../unittest')

class A {
    method1() {}
    prop = 1
}

class __GetFuncNamesTests extends unittest.TestCase {
    test_it_gets_only_functions() {
        const a = new A()
        const names = this.__getFuncNames(a)
        this.assertArrayContains('method1', names)
    }
}

unittest.register(__GetFuncNamesTests).run_if_main(module)
