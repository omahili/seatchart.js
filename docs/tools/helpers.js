exports.createId = function createId(id) {
    return id
        .replace('#', '')
        .replace('()', '')
        .replace(':', '-');
};
