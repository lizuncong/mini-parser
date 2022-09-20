const { Parser } = require('../src/parser')
const assert = require('assert')
const tests = [
    require('./literals-test'),
    require('./statement-list-test'),
    require('./block-test'),
    require('./empty-statement-test'),
    require('./math-test'),
    require('./variable-test')
]

const parser = new Parser()


// exec用于手动测试
function exec() {
    const program = ` 
     let y;
     let a, b;
     let c, d = 10;
     let x = 64;
     let foo = bar = 10;
     r = 10;
    `

    const ast = parser.parse(program)

    console.log(JSON.stringify(ast, null, 2))
}
exec()

function test(program, expected) {
    const ast = parser.parse(program)
    assert.deepEqual(ast, expected)
}
tests.forEach(testRun => testRun(test))

console.log('All assertions passed!')