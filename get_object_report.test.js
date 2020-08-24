const unittest = require('./unittest')
const object_equal = require('./lib/object_equal')


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

    test_err_when_values_are_not_of_same_type() {
        const err = object_equal({age: 7}, {age: 'bob'})
        this.assertEqual(err, 'unequal types found at "age"')
    }

    test_err_string_when_value_mismatch_found() {
        const err = object_equal({name: 7}, {name: 8})
        this.assertEqual(err, 'unequal values found at "name": 7 !== 8')
    }

    test_null_when_nested_objects_match() {
        const b = {person: {name: 'bob', age: 45}}
        const a = {person: {...b.person}}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_null_when_deep_nested_objects_match() {
        const a = {person: {name: 'bob', age: 45, address: {street: 'Penn Ave'}}}
        const b = {person: {name: 'bob', age: 45, address: {street: 'Penn Ave'}}}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_string_has_path_when_nested_object_contains_unequal_types() {
        const b = {person: {name: 'bob'}}
        const a = {person: {name: 7}}
        const err = object_equal(a, b)
        this.assertEqual(err, 'unequal types found at "person.name"')
    }

    test_string_has_path_when_nested_object_contains_unequal_values() {
        const a = {person: {name: 'bill'}}
        const b = {person: {name: 'bob'}}
        const err = object_equal(a, b)
        this.assertEqual(err, 'unequal values found at "person.name": "bill" !== "bob"')
    }

    test_it_returns_null_when_empty_arrays_match() {
        const a = {ages: []}
        const b = {ages: []}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_err_path_when_array_type_mismatch_found() {
        const a = {ages: [1]}
        const b = {ages: ['1']}
        const err = object_equal(a, b)
        this.assertEqual(err, 'unequal types found at "ages.0"')
    }

    test_it_returns_null_when_len1_arrays_match() {
        const a = {ages: [1]}
        const b = {ages: [1]}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_it_returns_null_when_len2_arrays_match() {
        const a = {ages: [1, 2]}
        const b = {ages: [1, 2]}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_it_returns_null_when_2_len1_arrays_match() {
        const a = {ages: [1], names: ['bill']}
        const b = {ages: [1], names: ['bill']}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_it_returns_null_with_nested_empty_arrays() {
        const a = {lists: [[]]}
        const b = {lists: [[]]}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_it_returns_null_with_matching_nested_arrays() {
        const a = {lists: [[1]]}
        const b = {lists: [[1]]}
        const err = object_equal(a, b)
        this.assertIsNull(err)
    }

    test_err_path_when_nested_arrays_values_do_not_match() {
        const a = {lists: [[1]]}
        const b = {lists: [[2]]}
        const err = object_equal(a, b)
        this.assertEqual(err, 'unequal values found at "lists.0.0": 1 !== 2')
    }

    test_err_path_when_nested_arrays_types_do_not_match() {
        const a = {lists: [[1]]}
        const b = {lists: [['1']]}
        const err = object_equal(a, b)
        this.assertEqual(err, 'unequal types found at "lists.0.0"')
    }

    test_err_path_when_nested_arrays_2nd_values_do_not_match() {
        const a = {lists: [[1, 2]]}
        const b = {lists: [[1, 1]]}
        const err = object_equal(a, b)
        this.assertEqual(err, 'unequal values found at "lists.0.1": 2 !== 1')
    }
}


unittest.register(GetObjectReportTests)


if (require.main === module) {
    unittest.main()
}
