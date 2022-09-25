const Spec = [
    [/^\s+/, null], // 跳过空格
    [/^\/\/.*/, null], // 跳过单行注释
    [/^\/\*[\s\S]*?\*\//, null], // 跳过多行注释
    /** 符号Symbols **/
    [/^;/, ';'], // 跳过分号
    [/^\{/, '{'],
    [/^\}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],
    [/^,/, ','],
    /** 关键字Keywords **/
    [/^\blet\b/, 'let'],
    [/^\bif\b/, 'if'],
    [/^\belse\b/, 'else'],
    [/^\btrue\b/, 'true'],
    [/^\bfalse\b/, 'false'],
    [/^\bnull\b/, 'null'],
    /** Numbers **/
    [/^\d+/, "NUMBER"],
    /** Identifiers **/
    [/^\w+/, 'IDENTIFIER'],
    /** Equality operators: ==, !== **/
    [/^[=!]=/, 'EQUALITY_OPERATOR'],

    /** Assignment operators: =, *=, /=, +=, -= **/
    [/^=/, 'SIMPLE_ASSIGN'], // 简单的赋值
    [/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],
    /** Math operators: +, -, *, **/
    [/^[+\-]/, 'ADDITIVE_OPERATOR'],
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],
    /** Relational operators: >, >=, <, <= **/
    [/^[><]=?/, 'RELATIONAL_OPERATOR'],
    /** Logical operators: &&, || **/
    [/^&&/, 'LOGICAL_AND'],
    [/^\|\|/, 'LOGICAL_OR'],
    [/^!/, 'LOGICAL_NOT'],

    /** 字符串 **/
    [/^"[^"]*"/, "STRING"],
    [/^'[^']*'/, "STRING"],
];
class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }
    isEOF() {
        return this._cursor === this._string.length;
    }
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }
        const string = this._string.slice(this._cursor);

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string);

            if (tokenValue === null) {
                continue;
            }
            if (tokenType === null) {
                return this.getNextToken()
            }
            return {
                type: tokenType,
                value: tokenValue,
            };
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`)
    }
    _match(regexp, string) {
        const matched = regexp.exec(string);
        if (matched === null) {
            return null;
        }
        this._cursor += matched[0].length;
        return matched[0];
    }
}

module.exports = {
    Tokenizer,
};
