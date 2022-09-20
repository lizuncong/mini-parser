const { Tokenizer } = require("./Tokenizer");
class Parser {
    constructor() {
        this._string = "";
        this._tokenizer = new Tokenizer();
    }
    // 将字符串转换成抽象语法树
    parse(string) {
        this._string = string;
        this._tokenizer.init(string);
        this._lookahead = this._tokenizer.getNextToken();
        return this.Program();
    }
    /**
     * Main entry point
     * Program
     *  : StatementList
     *  ;
     */
    Program() {
        return {
            type: "Program",
            body: this.StatementList(),
        };
    }
    /**
     * StatementList
     *  : Statement
     *  | StatementList Statement -> Statement Statement Statement Statement
     *  ;
     *
     */
    StatementList(stopLookahead = null) {
        const statementList = [this.Statement()];
        while (this._lookahead !== null && this._lookahead.type !== stopLookahead) {
            statementList.push(this.Statement());
        }
        return statementList;
    }
    /**
     * Statement
     *  : ExpressionStatement
     *  | BlockStatement
     *  | EmptyStatement
     *  | VariableStatement
     *  | IfStatement
     *  ;
     *
     */
    Statement() {
        switch (this._lookahead.type) {
            case ";":
                return this.EmptyStatement();
            case 'if':
                return this.IfStatement()
            case "{":
                return this.BlockStatement();
            case 'let':
                return this.VariableStatement()
            default:
                return this.ExpressionStatement();
        }
    }
    /**
     * IfStatement
     *  : 'if' '(' Expression ')' Statement
     *  | 'if' '(' Expression ')' Statement 'else' Statement
     *  ;
     */
    IfStatement() {
        this._eat('if')
        this._eat('(')
        const test = this.Expression()
        this._eat(')')
        const consequent = this.Statement()
        const alternate = this._lookahead != null && this._lookahead.type === 'else' ? this._eat('else') && this.Statement() : null
        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate
        }
    }
    /**
     * VariableStatement
     *  : 'let' VariableDeclarationList ';'
     *  ;
    */
    VariableStatement() {
        this._eat('let');
        const declarations = this.VariableDeclarationList()
        this._eat(';')
        return {
            type: 'VariableStatement',
            declarations
        }
    }
    /**
     * VariableDeclarationList
     *  : VariableDeclaration
     *  | VariableDeclarationList ',' VariableDeclaration
     *  ;
    */
    VariableDeclarationList() {
        const declarations = []
        do {
            declarations.push(this.VariableDeclaration())
        } while (this._lookahead.type === ',' && this._eat(','))
        return declarations;
    }
    /**
     * VariableDeclaration
     *  : Identifier OptVariableInitializer
     *  ;
    */
    VariableDeclaration() {
        const id = this.Identifier()
        const init = this._lookahead.type !== ';' && this._lookahead.type !== ',' ? this.VariableInitializer() : null
        return {
            type: 'VariableDeclaration',
            id,
            init
        }
    }
    /**
     * VariableInitializer
     *  : SIMPLE_ASSIGN AssignmentExpression
     *  ;
    */
    VariableInitializer() {
        this._eat('SIMPLE_ASSIGN')
        return this.AssignmentExpression()
    }
    /**
     * EmptyStatement
     *  : ';'
     *  ;
     *
     */
    EmptyStatement() {
        this._eat(";");
        return {
            type: "EmptyStatement",
        };
    }
    /**
     * BlockStatement
     *  : '{' OptStatementList '}'
     *  ;
     *
     */
    BlockStatement() {
        this._eat("{");
        const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];
        this._eat("}");
        return {
            type: "BlockStatement",
            body,
        };
    }
    /**
     * ExpressionStatement
     *  : Expression ';'
     *  ;
     *
     */
    ExpressionStatement() {
        const expression = this.Expression();
        this._eat(";");
        return {
            type: "ExpressionStatement",
            expression,
        };
    }
    /**
     * Expression
     *  : Literal
     *  ;
     */
    Expression() {
        return this.AssignmentExpression();
    }
    /**
     * AssignmentExpression
     *  : RelationalExpression
     *  | LeftHandSideExpression AssignmentOperator AssignmentExression
     *  ;
    */
    AssignmentExpression() {
        const left = this.RelationalExpression();
        if (!this._isAssignmentOperator(this._lookahead.type)) {
            return left
        }
        return {
            type: 'AssignmentExpression',
            operator: this.AssignmentOperator().value,
            left: this._checkValidAssignmentTarget(left),
            right: this.AssignmentExpression()
        }
    }
    /**
     * RELATIONAL_OPERATOR: >, >=, <, <=
     * x < y
     * x >= y
     * x < y
     * x <= y
     * 
     * RelationalExpression
     *  : AdditiveExpression
     *  | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
    */
    RelationalExpression() {
        return this._BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR')
    }
    /**
     * LeftHandSideExpression
     *  : Identifier
     *  ;
    */
    LeftHandSideExpression() {
        return this.Identifier()
    }
    /**
     * Identifier
     *  : IDENTIFIER
     *  ;
    */
    Identifier() {
        const name = this._eat('IDENTIFIER').value
        return {
            type: 'Identifier',
            name
        }
    }
    _checkValidAssignmentTarget(node) {
        if (node.type === 'Identifier') {
            return node
        }
        throw new SyntaxError('Invalid left-hand side in assignment expression')
    }
    /**
     * token是否是赋值操作符
    */
    _isAssignmentOperator(tokenType) {
        return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN'
    }
    /**
     * AssignmentOperator
     *  : SIMPLE_ASSIGN
     *  | COMPLEX_ASSIGN
     *  ;
    */
    AssignmentOperator() {
        if (this._lookahead.type === 'SIMPLE_ASSIGN') {
            return this._eat('SIMPLE_ASSIGN')
        }
        return this._eat('COMPLEX_ASSIGN')
    }
    /**
     * AdditiveExpression
     *  : MultiplicativeExpression
     *  | AdditiveExpression ADDITIVE_OPERATOR Literal -> Literal ADDITIVE_OPERATOR Literal ADDITIVE_OPERATOR Literal
     *  ;
     */
    AdditiveExpression() {
        return this._BinaryExpression('MultiplicativeExpression', 'ADDITIVE_OPERATOR')
    }
    /**
     * MultiplicativeExpression
     *  : PrimaryExpression
     *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression -> PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
     *  ;
    */
    MultiplicativeExpression() {
        return this._BinaryExpression('PrimaryExpression', 'MULTIPLICATIVE_OPERATOR')
    }
    /**
     * Generic binary expression
     * 
    */
    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();
        while (this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();
            left = {
                type: "BinaryExpression",
                operator,
                left,
                right,
            };
        }
        return left;
    }
    /**
     * PrimaryExpression
     *  : Literal
     *  | ParenthesizedExpression
     *  | LeftHandSideExpression
     *  ;
     * 
    */
    PrimaryExpression() {
        if (this._isLiteral(this._lookahead.type)) {
            return this.Literal()
        }
        switch (this._lookahead.type) {
            case '(':
                return this.ParenthesizedExpression();
            default:
                return this.LeftHandSideExpression()
        }
    }
    _isLiteral(tokenType) {
        return tokenType === 'NUMBER' || tokenType === 'STRING'
    }
    /**
     * ParenthesizedExpression
     *  : '(' Expression ')'
     *  ;
     * 
    */
    ParenthesizedExpression() {
        this._eat('(')
        const expression = this.Expression()
        this._eat(')')
        return expression
    }
    /**
     * Literal
     *  : NumericLiteral
     *  | StringLiteral
     *  ;
     */
    Literal() {
        switch (this._lookahead.type) {
            case "NUMBER":
                return this.NumericLiteral();
            case "STRING":
                return this.StringLiteral();
        }
        throw new SyntaxError(`Literal: unexpected literal production`);
    }
    /**
     * StringLiteral
     *  : STRING
     *  ;
     *
     */
    StringLiteral() {
        const token = this._eat("STRING");
        return {
            type: "StringLiteral",
            value: token.value.slice(1, -1), // 去掉引号
        };
    }
    /**
     * NumericLiteral
     *  : NUMBER
     *  ;
     *
     */
    NumericLiteral() {
        const token = this._eat("NUMBER");
        return {
            type: "NumericLiteral",
            value: Number(token.value),
        };
    }

    _eat(tokenType) {
        const token = this._lookahead;
        if (token === null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: "${tokenType}"`
            );
        }
        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected: "${tokenType}"`
            );
        }
        this._lookahead = this._tokenizer.getNextToken();
        return token;
    }
}

module.exports = {
    Parser,
};
