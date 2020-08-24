module.exports = object_equal

function object_equal(a, b, parent_paths=[]) {
    const a_copy = {...a}
    const next_a = {}
    const next_b = {}
    // evaluate primitives
    const msg = new Message(parent_paths)

    for (let prop in b) {
        msg.setPropName(prop)

        if (!a_copy.hasOwnProperty(prop)) {
            return msg.missing_property()
        }
        const a_type = to_type(a_copy[prop])
        if (!a_type.equals(to_type(b[prop]))) {
            return msg.unequal_types_found()
        }
        const type = a_type

        if (type.is_object()) {
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


class Type {
    constructor(value) {
        this.value = value
    }

    is_object() {
        return typeof this.value === 'object'
    }

    is_string() {
        return typeof this.value === 'string'
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

    setPropName(propName) {
        this.prop = propName
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
