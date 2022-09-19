const { Tokenizer } = require('./Tokenizer')
class Parser {
    constructor() {
        this._string = ''
        this._tokenizer = new Tokenizer();
    }
    // 将字符串转换成抽象语法树
    parse(string) {
        this._string = string;
        this._tokenizer.init(string)
        this._lookahead = this._tokenizer.getNextToken();
        return this.Program()
    }
    /**
     * Main entry point
     * Program
     *  : StatementList
     *  ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.StatementList()
        }
    }
    /**
     * StatementList
     *  : Statement
     *  | StatementList Statement -> Statement Statement Statement Statement
     *  ;
     * 
    */
    StatementList(stopLookahead = null) {
        const statementList = [this.Statement()]
        while (this._lookahead !== null && this._lookahead.type !== stopLookahead) {
            statementList.push(this.Statement())
        }
        return statementList
    }
    /**
     * Statement
     *  : ExpressionStatement
     *  | BlockStatement
     *  | EmptyStatement
     *  ;
     * 
    */
    Statement() {
        switch (this._lookahead.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement()
        }
    }
    /**
     * EmptyStatement
     *  : ';'
     *  ;
     * 
    */
    EmptyStatement() {
        this._eat(';')
        return {
            type: 'EmptyStatement',
        }
    }
    /**
     * BlockStatement
     *  : '{' OptStatementList '}'
     *  ;
     * 
    */
    BlockStatement() {
        this._eat('{')
        const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
        this._eat('}')
        return {
            type: 'BlockStatement',
            body,
        }
    }
    /**
     * ExpressionStatement
     *  : Expression ';'
     *  ;
     * 
    */
    ExpressionStatement() {
        const expression = this.Expression()
        this._eat(';')
        return {
            type: 'ExpressionStatement',
            expression
        }
    }
    /**
     * Expression
     *  : Literal
     *  ;
    */
    Expression() {
        return this.Literal()
    }
    /**
     * Literal
     *  : NumericLiteral
     *  | StringLiteral
     *  ;
    */
    Literal() {
        switch (this._lookahead.type) {
            case 'NUMBER': return this.NumericLiteral();
            case 'STRING': return this.StringLiteral();
        }
        throw new SyntaxError(`Literal: unexpected literal production`)
    }
    /**
     * StringLiteral
     *  : STRING
     *  ;
     * 
    */
    StringLiteral() {
        const token = this._eat('STRING')
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1), // 去掉引号
        }
    }
    /**
     * NumericLiteral
     *  : NUMBER
     *  ;
     * 
    */
    NumericLiteral() {
        const token = this._eat('NUMBER')
        return {
            type: 'NumericLiteral',
            value: Number(token.value)
        }
    }

    _eat(tokenType) {
        const token = this._lookahead;
        if (token === null) {
            throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`)
        }
        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: "${tokenType}"`)
        }
        this._lookahead = this._tokenizer.getNextToken()
        return token
    }
}

module.exports = {
    Parser,
};
