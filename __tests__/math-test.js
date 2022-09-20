module.exports = test => {
    test(`2 + 2;`, {
        type: 'Program',
        body: [{
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'NumericLiteral',
                    value: 2
                },
                right: {
                    type: 'NumericLiteral',
                    value: 2
                }
            }
        }]
    })
    test(`3 + 2 - 2;`, {
        type: 'Program',
        body: [{
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        value: 3
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                },
                right: {
                    type: 'NumericLiteral',
                    value: 2
                }
            }
        }]
    })
    test(`3 + 2 * 2;`, {
        type: 'Program',
        body: [{
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'NumericLiteral',
                    value: 3
                },
                right: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'NumericLiteral',
                        value: 2
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        }]
    })
    test(`2 * 2;`, {
        type: 'Program',
        body: [{
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'NumericLiteral',
                    value: 2
                },
                right: {
                    type: 'NumericLiteral',
                    value: 2
                }
            }
        }]
    })
    test(`3 * 2 * 2;`, {
        type: 'Program',
        body: [{
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                right: {
                    type: 'NumericLiteral',
                    value: 2
                },
                left: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'NumericLiteral',
                        value: 3
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        }]
    })
    test(`(3 + 2) * 2;`, {
        type: 'Program',
        body: [{
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                right: {
                    type: 'NumericLiteral',
                    value: 2
                },
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        value: 3
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        }]
    })
}