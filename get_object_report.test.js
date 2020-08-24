const unittest = require('./unittest')

// _.isEqual()
function object_equal(a, b) {
    const a_copy = {...a}
    for (let prop in b) {
        if (!a_copy.hasOwnProperty(prop)) {
            return `missing property "${prop}"`
        }
        if (a_copy[prop] === b[prop]) {
            delete a_copy[prop]
            continue
        }
    }
    const a_keys = Object.keys(a_copy)
    if (a_keys.length > 0) {
        return 'extra properties found: ' + a_keys.join(', ')
    }
    return null
}

/**
 * I'm trying for the wrong thing here...
 *   I should really be shooting for a function that gives me something like List[Tuple[Path, Value]]
 *   [
 *     ['orig_key   synthetic_path', 'value'],
 *     ['people [0]. age    array  [0].age', 45],
 *     ['people[0] array  [0].name'],
 *     ['people    array  [0].name', 'bob'],
 *     ['location  string ""', 'NYC']
 *   ]
 *
 *   this way there are no negative consequences for a name clash.
 */

class GetObjectReportTests extends unittest.TestCase {
    test_returns_null_when_both_are_empty_objects() {
        const err = object_equal({}, {})
        this.assertIsNull(err)
    }

    test_it_returns_err_string_when_subject_does_not_contain_all_keys_of_control() {
        const err = object_equal({}, {name: 'bob'})
        this.assertEqual(err, 'missing property "name"')
    }

    test_err_string_when_subject_has_one_too_many_keys() {
        const err = object_equal({name: 'bob', age: 34}, {name: 'bob'})
        this.assertEqual(err, 'extra properties found: age')
    }

    test_err_string_when_subject_has_two_too_many_keys() {
        const err = object_equal({name: 'bob', age: 34, gender: 'F'}, {name: 'bob'})
        this.assertEqual(err, 'extra properties found: age, gender')
    }


    // test_array() {
    //     const res = flattenObject({names: ['bob']})
    //     this.assertEqual(res['names[0]'], 'bob')
    //     this.assertEqual(Object.keys(res).length, 1)
    // }

    // test_empty_array() {
    //     const res = flattenObject({
    //         people: []})
    //     this.assertEqual(res['people[]'], '____EMPTY_')
    // }

    // test_array_with_object() {
    //     const res = flattenObject({people: [{age: 1}]})
    //     this.assertEqual(res['people[0].age'], 1)
    // }
}


unittest.register(GetObjectReportTests)


if (require.main === module) {
    unittest.main()
}
