const cvs = document.getElementById('game')
const ctx = cvs.getContext('2d')

let rAF = null

const game = {
    cellSize: 30,
    playField: [],
    rowCount: 20,
    colCount: 10,
    accLevels: {
        EASY: 60,
        NORMAL: 45,
        HARD: 30
    },
    tetrominos: {
        'I': [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        'O': [
            [1, 1],
            [1, 1]
        ],
        'S': [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        'Z': [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        'L': [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        'J': [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        'T': [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    tetrominoColors: {
        'I': '#00ffff',
        'O': '#ffff00',
        'S': '#ff0000',
        'J': '#0000ff',
        'L': '#ff7f00',
        'T': '#800080',
        'Z': '#00ff00'
    },
    currentSequence: [],
    currentTetromino: null,
    frameCounter: 0,
    startGame() { 
        this.initPlayField()
        this.generateSequence()
        this.currentTetromino = this.getNextTetromino()
        this.draw()
    },
    initPlayField() {
        const { rowCount, colCount } = this

        this.playField = []
        for (let row = 0; row < rowCount; row++) {
            const tmpRow = []
            for (let col = 0; col < colCount; col++) {
                tmpRow.push(0)
            }
            this.playField.push(tmpRow)
        }
    },
    generateSequence() {
        const tetroNames = Object.keys(this.tetrominos)
        while (this.currentSequence.length !== tetroNames.length) {
            const randomName = tetroNames[Math.floor(Math.random() * tetroNames.length)]
            if (!this.currentSequence.includes(randomName)) {
                this.currentSequence.unshift(randomName)
            }
        }
    },
    getNextTetromino() {
        if (!this.currentSequence.length) {
            this.generateSequence()
        }

        const tetroName = this.currentSequence.shift()
        const matrix = this.tetrominos[tetroName]
        const initRow = tetroName === 'I' ? -1 : -2
        const initCol = this.playField[0].length / 2 - Math.ceil(matrix[0].length / 2);

        return {
            name: tetroName,
            row: initRow,
            col: initCol,
            matrix: this.tetrominos[tetroName]
        }
    },
    isMoveValid(cellRow, cellCol) {
        if (this.currentTetromino) {
            for (let row = 0; row < this.currentTetromino.matrix.length; row++) {
                for (let col = 0; col < this.currentTetromino.matrix[row].length; col++) {
                    if (this.currentTetromino.matrix[row][col]) {
                        if (cellRow + row >= this.rowCount ||
                            cellCol + col < 0 ||
                            cellCol + col >= this.colCount ||
                            this.playField[cellRow + row]?.[cellCol + col]) {
                            return false
                        }
                    }
                }
            }
        }
        return true
    },
    setUpTetromino() {

        for (let row = 0; row < this.currentTetromino.matrix.length; row++) {
            for (let col = 0; col < this.currentTetromino.matrix[row].length; col++) {
                if (this.currentTetromino.matrix[row][col]) {

                    this.playField[this.currentTetromino.row + row][this.currentTetromino.col + col] = this.currentTetromino.name
                }
            }
        }

        console.log('+')

        this.currentTetromino = this.getNextTetromino()
    },
    draw() {

        ctx.clearRect(0, 0, cvs.width, cvs.height)

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, cvs.width, cvs.height)

        if (this.currentTetromino) {
            ++this.frameCounter
            if (this.frameCounter === this.accLevels.EASY) {
                this.currentTetromino.row++
                this.frameCounter = 0
            }
            if (!this.isMoveValid(this.currentTetromino.row, this.currentTetromino.col)) {
                this.currentTetromino.row--
                this.setUpTetromino()
            }
            for (let row = 0; row < this.currentTetromino.matrix.length; row++) {
                for (let col = 0; col < this.currentTetromino.matrix[row].length; col++) {
                    if (this.currentTetromino.matrix[row][col]) {
                        ctx.fillStyle = this.tetrominoColors[this.currentTetromino.name]
                        ctx.fillRect(
                            this.currentTetromino.col * this.cellSize + col * this.cellSize,
                            this.currentTetromino.row * this.cellSize + row * this.cellSize, 
                            this.cellSize,
                            this.cellSize
                        )
                    }
                }
            }
        }

        for (let row = 0; row < this.rowCount; row++) {
            for (let col = 0; col < this.colCount; col++) {
                if (this.playField[row][col]) { 
                    ctx.fillStyle = this.tetrominoColors[this.playField[row][col]]
                    ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize, 
                        this.cellSize,
                        this.cellSize
                    )
                }
            }
        }

        rAF = requestAnimationFrame(this.draw.bind(this))
    }
}

game.startGame()