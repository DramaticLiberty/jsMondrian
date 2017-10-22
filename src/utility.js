function ifUndefined(value, undefValue) {
    if (typeof value != 'undefined') {
        return value;
    } else {
        return undefValue;
    }
}
