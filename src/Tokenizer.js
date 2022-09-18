class Tokenizer {
    init(string) {
        this._string = string
        this._cursor = 0
    }
    isEOF() {
        return this._cursor === this._string.length
    }
    hasMoreTokens() {
        return this._cursor < this._string.length
    }
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null
        }
        const string = this._string.slice(this._cursor)
        // Numbers
        if (!Number.isNaN(Number(string[0]))) {
            let number = ''
            while (!Number.isNaN(Number(string[this._cursor]))) {
                number += string[this._cursor++]
            }
            return {
                type: 'NUMBER',
                value: number
            }
        }
        // Strings:
        if (string[0] === '"') {
            let s = '';
            do {
                s += string[this._cursor++];
            } while (string[this._cursor] !== '"' && !this.isEOF())
            s += this._cursor++
            return {
                type: 'STRING',
                value: s
            }
        }
        return null
    }
}

module.exports = {
    Tokenizer,
};