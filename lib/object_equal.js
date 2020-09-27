module.exports = object_equal

function object_equal(a, b, parent_paths=[]) {
    const a_copy = {...a}
    const next_a = {}
    const next_b = {}
    // evaluate primitives
    const msg = new Message(parent_paths)

    for (let prop in b) {

        msg.set_prop_name(prop)

        if (!a_copy.hasOwnProperty(prop)) {
            return msg.missing_property()
        }

        const a_type = to_type(a_copy[prop])
        const b_type = to_type(b[prop])

        if (!a_type.equals(b_type)) {
            return msg.unequal_types_found()
        }

        const type = a_type

        // should I really do this?
        if (type.implements_equals()) {
            if (!a_copy[prop].equals(b[prop])) {
                return msg.value_mismatch_found(type, a_copy[prop], b[prop])
            }
        }

        if (type.is_object()) {
            const is_arr_vs_obj = xor(a_type.is_array(), b_type.is_array())
            if (is_arr_vs_obj) {
                return msg.cannot_compare_array_and_object(a_type, b_type)
            }
            next_a[prop] = a_copy[prop]
            next_b[prop] = b[prop]
            delete a_copy[prop]; continue
        }

        if (a_copy[prop] !== b[prop]) {
            return msg.value_mismatch_found(type, a_copy[prop], b[prop])
        }

        delete a_copy[prop]
    }
    // recurse to eval complex types
    if (Object.keys(next_b).length > 0) {
        for (let key in next_b) {
            const err = object_equal(next_a[key], next_b[key], [...parent_paths, key])
            if (err) return err
        }
    }

    const a_keys = Object.keys(a_copy)
    if (a_keys.length > 0) {
        return msg.extra_properties_found(a_keys)
    }
    return null
}


function to_type(x) {
    return new Type(x)
}

function xor(a, b) {
    if (a && b) {
        return false
    }
    if (!a && !b) {
        return false
    }
    return true
}


class Type {
    constructor(value) {
        this.value = value
    }

    is_object() {
        return typeof this.value === 'object'
    }

    is_array() {
        return Array.isArray(this.value)
    }

    is_string() {
        return typeof this.value === 'string'
    }

    implements_equals() {
        if (typeof this.value !== 'object') {
            return false
        }
        if (typeof this.value.equals !== 'function') {
            return false
        }
        return true
    }

    get_type_string() {
        if (Array.isArray(this.value)) {
            return 'array'
        }
        return typeof this.value
    }

    equals(other) {
        if (!other instanceof Type) {
            return false
        }
        return typeof this.value === typeof other.value
    }
}


class Message {
    constructor(parent_paths) {
        this.parent_paths = parent_paths
        this.prop = null
    }

    set_prop_name(propName) {
        this.prop = propName
    }

    cannot_compare_array_and_object(a, b) {
        return `could not compare ${a.get_type_string()} with ${b.get_type_string()} at "${[...this.parent_paths, this.prop].join('.')}"`
    }

    unequal_types_found() {
        return `unequal types found at "${[...this.parent_paths, this.prop].join('.')}"`
    }

    missing_property() {
        return `missing property "${[...this.parent_paths, this.prop].join('.')}"`
    }

    value_mismatch_found(type, left, right) {
        let extension = `${left} !== ${right}`
        if (type.is_string()) {
            extension = `"${left}" !== "${right}"`
        }
        return `unequal values found at "${[...this.parent_paths, this.prop].join('.')}": ` + extension
    }

    extra_properties_found(keys) {
        return 'extra properties found: ' + keys.join(', ')
    }
}
