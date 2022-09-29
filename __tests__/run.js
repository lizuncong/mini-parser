const { Parser } = require('../src/parser')
const assert = require('assert')
const tests = [
    require('./literals-test'),
    require('./statement-list-test'),
    require('./block-test'),
    require('./empty-statement-test'),
    require('./math-test'),
    require('./variable-test'),
    require('./if-test'),
    require('./relational-test'),
    require('./equality-test'),
    require('./logical-test'),
    require('./unary-test'),
    require('./while-test'),
    require('./function-declaration-test')
]

const parser = new Parser()


// exec用于手动测试
function exec() {
    const program = ` 
       class Point {
            function constructor(x, y){
                this.x = x;
                this.y = y;
            }
            function calc(){
                return this.x + this.y;
            }
       }
       class Point3D extends Point{
            function constructor(x, y, z){
                super(x, y);
                this.z = z;
            }
            function calc(){
                return super() + this.z;
            }
       }
       let p = new Point3D(10, 20, 30);
       p.calc();
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