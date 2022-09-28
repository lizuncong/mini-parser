module.exports = test => {
    test(`x.y;`, {});
    test(`x.y = 1;`, {});
    test(`x[0] = 1;`, {});
    test(`a.b.c['d'];`, {});

}