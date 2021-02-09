var argument = window.location.search.substr(1);
var firstHand = document.getElementById("firstHand");
var backHand = document.getElementById("backHand");
var board = document.getElementById("board");

if(argument !== "firstHand" && argument !== "backHand") {
    firstHand.onclick = () => {
        window.location.href = "Gobang.html?firstHand";
    };
    backHand.onclick = () => {
        window.location.href = "Gobang.html?backHand";
    };
}
else {
    firstHand.setAttribute("hidden", "hidden");
    backHand.setAttribute("hidden", "hidden");
    board.removeAttribute("hidden");
    board.style.alignSelf = "center";

    // Identifier
    const BOUND = 0;
    const BLANK = 1;
    const BLACK = 2;
    const WHITE = 3;

    // Argument
    const SIZE  = 15;
    const WIDTH = 5;
    const DEPTH = 5;
    const RATIO = (argument === "firstHand") ? 0.9 : 1.1;

    // Simulation
    const INF  = 2147483647;
    const NINF = -2147483648;

    // Pattern for win
    const PATTERN_WIN = [
        [1,  BLACK, BLACK, BLACK, BLACK, BLACK], // X X X X X
        [-1, WHITE, WHITE, WHITE, WHITE, WHITE]  // O O O O O
    ];

    // Pattern for score
    const PATTERN_SCORE = [
        [1,               BLANK, BLANK, BLACK, BLACK, BLANK, BLANK], // _ _ X X _ _
        [1,               BLANK, BLACK, BLANK, BLACK, BLANK],        // _ X _ X _
        [1,               BLANK, BLACK, BLANK, BLANK, BLACK, BLANK], // _ X _ _ X _
        [4000,            BLANK, BLACK, BLACK, BLACK, BLANK],        // _ X X X _
        [4000,            BLANK, BLACK, BLACK, BLANK, BLACK, BLANK], // _ X X _ X _
        [4000,            BLANK, BLACK, BLANK, BLACK, BLACK, BLANK], // _ X _ X X _
        [5000,            BOUND, BLACK, BLACK, BLACK, BLACK, BLANK], // | X X X X _
        [5000,            BLANK, BLACK, BLACK, BLACK, BLACK, BOUND], // _ X X X X |
        [5000,            WHITE, BLACK, BLACK, BLACK, BLACK, BLANK], // O X X X X _
        [5000,            BLANK, BLACK, BLACK, BLACK, BLACK, WHITE], // _ X X X X O
        [5000,            BLACK, BLACK, BLACK, BLANK, BLACK],        // X X X _ X
        [5000,            BLACK, BLANK, BLACK, BLACK, BLACK],        // X _ X X X
        [5000,            BLACK, BLACK, BLANK, BLACK, BLACK],        // X X _ X X
        [9000,            BLANK, BLACK, BLACK, BLACK, BLACK, BLANK], // _ X X X X _
        [100000,          BLACK, BLACK, BLACK, BLACK, BLACK],        // X X X X X
        [-1,              BLANK, BLANK, WHITE, WHITE, BLANK, BLANK], // _ _ O O _ _
        [-1,              BLANK, WHITE, BLANK, WHITE, BLANK],        // _ O _ O _
        [-1,              BLANK, WHITE, BLANK, BLANK, WHITE, BLANK], // _ O _ _ O _
        [RATIO * -4000,   BLANK, WHITE, WHITE, WHITE, BLANK],        // _ O O O _
        [RATIO * -4000,   BLANK, WHITE, WHITE, BLANK, WHITE, BLANK], // _ O O _ O _
        [RATIO * -4000,   BLANK, WHITE, BLANK, WHITE, WHITE, BLANK], // _ O _ O O _
        [RATIO * -5000,   BOUND, WHITE, WHITE, WHITE, WHITE, BLANK], // | O O O O _
        [RATIO * -5000,   BLANK, WHITE, WHITE, WHITE, WHITE, BOUND], // _ O O O O |
        [RATIO * -5000,   BLACK, WHITE, WHITE, WHITE, WHITE, BLANK], // X O O O O _
        [RATIO * -5000,   BLANK, WHITE, WHITE, WHITE, WHITE, BLACK], // _ O O O O X
        [RATIO * -5000,   WHITE, WHITE, WHITE, BLANK, WHITE],        // O O O _ O
        [RATIO * -5000,   WHITE, BLANK, WHITE, WHITE, WHITE],        // O _ O O O
        [RATIO * -5000,   WHITE, WHITE, BLANK, WHITE, WHITE],        // O O _ O O
        [RATIO * -9000,   BLANK, WHITE, WHITE, WHITE, WHITE, BLANK], // _ O O O O _
        [RATIO * -100000, WHITE, WHITE, WHITE, WHITE, WHITE]         // O O O O O
    ];

    class Util {
        constructor() {}

        length(array) {
            return array.length;
        }

        empty(array) {
            return this.length(array) === 0;
        }

        head(array) {
            return array[0];
        }

        tail(array) {
            return array[this.length(array) - 1];
        }

        remove(array, item) {
            array.splice(array.findIndex((temp) => {
                return JSON.stringify(temp) === JSON.stringify(item);
            }), 1);
        }

        copy(array) {
            return JSON.parse(JSON.stringify(array));
        }

        vertical(array, index) {
            var temp = [];
            for(var i = 0; i < this.length(array); ++i) {
                temp.push(array[i][index]);
            }
            return temp;
        }

        diagonal(array, right, index) {
            var temp = [];
            if(right) {
                if(index >= 0) {
                    for(var i = index; i < this.length(array); ++i) {
                        temp.push(array[i][i - index]);
                    }
                }
                else {
                    for(var i = -index; i < this.length(array); ++i) {
                        temp.push(array[i + index][i]);
                    }
                }
            }
            else {
                if(index >= 0) {
                    for(var i = index; i < this.length(array); ++i) {
                        temp.push(array[i][this.length(array) - 1 - i + index]);
                    }
                }
                else {
                    for(var i = -index; i < this.length(array); ++i) {
                        temp.push(array[i + index][this.length(array) - 1 - i]);
                    }
                }
            }
            return temp;
        }

        sort(a, b, ascend) {
            var flag = true;
            var index = this.length(a) - 1;
            while(flag) {
                flag = false;
                for(var i = 0; i < index; ++i) {
                    if(ascend) {
                        if(a[i] > a[i + 1]) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            temp = b[i];
                            b[i] = b[i + 1];
                            b[i + 1] = temp;
                            flag = true;
                        }
                    }
                    else {
                        if(a[i] < a[i + 1]) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            temp = b[i];
                            b[i] = b[i + 1];
                            b[i + 1] = temp;
                            flag = true;
                        }
                    }
                }
                --index;
            }
        }
    }

    var util = new Util();

    class Queue {
        constructor() {
            this.queue = [];
        }

        size() {
            return util.length(this.queue);
        }

        empty() {
            return util.empty(this.queue);
        }

        head() {
            return util.head(this.queue);
        }

        enqueue(item) {
            this.queue.push(item);
        }

        dequeue() {
            this.queue.shift();
        }
    }

    class ACItem {
        constructor() {
            this.output = false;
            this.success = [null, null, null, null];
            this.fail = null;
            this.score = 0;
        }

        getOutput() {
            return this.output;
        }

        getSuccess(index) {
            return this.success[index];
        }

        getFail() {
            return this.fail;
        }

        getScore() {
            return this.score;
        }

        setOutput() {
            this.output = true;
        }

        setSuccess(index, item) {
            this.success[index] = item;
        }

        setFail(item) {
            this.fail = item;
        }

        setScore(score) {
            this.score = score;
        }
    }

    class AC {
        constructor(pattern) {
            this.tree = new ACItem();
            for(var i = 0; i < util.length(pattern); ++i) {
                var pointer = this.tree;
                for(var j = 0; j < util.length(pattern[i]) - 1; ++j) {
                    if(pointer.getSuccess(pattern[i][j + 1]) === null) {
                        pointer.setSuccess(pattern[i][j + 1], new ACItem());
                    }
                    pointer = pointer.getSuccess(pattern[i][j + 1]);
                }
                pointer.setOutput();
                pointer.setScore(pattern[i][0]);
            }
            this.tree.setFail(this.tree);
            for(var i = 0; i < 4; ++i) {
                if(this.tree.getSuccess(i) !== null) {
                    this.tree.getSuccess(i).setFail(this.tree);
                }
            }
            var queue = new Queue();
            queue.enqueue(this.tree);
            while(!queue.empty()) {
                var pointer = queue.head();
                queue.dequeue();
                for(var i = 0; i < 4; ++i) {
                    if(pointer.getSuccess(i) !== null) {
                        queue.enqueue(pointer.getSuccess(i));
                        if(pointer.getSuccess(i).getFail() === null) {
                            var temp = pointer.getFail();
                            while(temp.getSuccess(i) === null && temp !== this.tree) {
                                temp = temp.getFail();
                            }
                            if(temp.getSuccess(i) !== null) {
                                pointer.getSuccess(i).setFail(temp.getSuccess(i));
                            }
                            else {
                                pointer.getSuccess(i).setFail(this.tree);
                            }
                        }
                    }
                }
            }
        }

        match(target) {
            var pointer = this.tree;
            var score = 0;
            for(var i = 0; i < util.length(target); ++i) {
                while(pointer.getSuccess(target[i]) === null && pointer !== this.tree) {
                    pointer = pointer.getFail();
                }
                if(pointer.getSuccess(target[i]) !== null) {
                    pointer = pointer.getSuccess(target[i]);
                }
                if(pointer.getOutput()) {
                    score += pointer.getScore();
                }
            }
            return score;
        }
    }

    var acWin = new AC(PATTERN_WIN);
    var acScore = new AC(PATTERN_SCORE);

    class Board {
        constructor(size) {
            this.size = size;
            this.board = [];
            for(var i = 0; i < this.size + 2; ++i) {
                this.board.push([]);
            }
            for(var i = 0; i < this.size + 2; ++i) {
                this.board[0].push(BOUND);
                this.board[this.size + 1].push(BOUND);
            }
            for(var i = 0; i < this.size; ++i) {
                this.board[i + 1].push(BOUND);
                for(var j = 0; j < this.size; ++j) {
                    this.board[i + 1].push(BLANK);
                }
                this.board[i + 1].push(BOUND);
            }
        }

        getSize() {
            return this.size;
        }

        getBoard() {
            return this.board;
        }

        chess(x, y, role) {
            this.board[x][y] = role;
        }
    }

    class Robot {
        constructor(role, width, depth) {
            this.role = role;
            this.width = width;
            this.depth = depth;
        }

        getRole() {
            return this.role;
        }

        neighbor(arena, x, y) {
            for(var i = 1; i < 3; ++i) {
                for(var j = 0; j < 2 * i; ++j) {
                    var [m, n] = [x + i - j, y - i];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && arena.board.getBoard()[m][n] !== BOUND && arena.board.getBoard()[m][n] !== BLANK) {
                        return true;
                    }
                    [m, n] = [x + i, y + i - j];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && arena.board.getBoard()[m][n] !== BOUND && arena.board.getBoard()[m][n] !== BLANK) {
                        return true;
                    }
                    [m, n] = [x - i + j, y + i];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && arena.board.getBoard()[m][n] !== BOUND && arena.board.getBoard()[m][n] !== BLANK) {
                        return true;
                    }
                    [m, n] = [x - i, y - i + j];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && arena.board.getBoard()[m][n] !== BOUND && arena.board.getBoard()[m][n] !== BLANK) {
                        return true;
                    }
                }
            }
            return false;
        }

        rearrange(arena, role) {
            var [x, y] = util.tail(arena.used);
            for(var i = 1; i >= 1; --i) {
                for(var j = 2 * i - 1; j >= 0; --j) {
                    var [m, n] = [x + i - j, y - i];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && (arena.board.getBoard()[m][n] === BOUND || arena.board.getBoard()[m][n] === BLANK)) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                }
                for(var j = 2 * i - 1; j >= 0; --j) {
                    var [m, n] = [x + i, y + i - j];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && (arena.board.getBoard()[m][n] === BOUND || arena.board.getBoard()[m][n] === BLANK)) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                }
                for(var j = 2 * i - 1; j >= 0; --j) {
                    var [m, n] = [x - i + j, y + i];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && (arena.board.getBoard()[m][n] === BOUND || arena.board.getBoard()[m][n] === BLANK)) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                }
                for(var j = 2 * i - 1; j >= 0; --j) {
                    var [m, n] = [x - i, y - i +j];
                    if(m >= 1 && m <= arena.board.getSize() && n >= 1 && n <= arena.board.getSize() && (arena.board.getBoard()[m][n] === BOUND || arena.board.getBoard()[m][n] === BLANK)) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                }
            }
            var temp =[];
            for(var i = 0; i < util.length(arena.rest); ++i) {
                var [m, n] = arena.rest[i];
                if(!this.neighbor(arena, m, n)) {
                    temp.push(0);
                }
                else {
                    var score = 0;
                    arena.board.chess(m, n, role);
                    score += acScore.match(arena.board.getBoard()[m]);
                    score += acScore.match(util.vertical(arena.board.getBoard(), n));
                    score += acScore.match(util.diagonal(arena.board.getBoard(), true, m - n));
                    score += acScore.match(util.diagonal(arena.board.getBoard(), false, m - (arena.board.getSize() + 1 - n)));
                    arena.board.chess(m, n, (role === BLACK) ? WHITE : BLACK);
                    score -= acScore.match(arena.board.getBoard()[m]);
                    score -= acScore.match(util.vertical(arena.board.getBoard(), n));
                    score -= acScore.match(util.diagonal(arena.board.getBoard(), true, m - n));
                    score -= acScore.match(util.diagonal(arena.board.getBoard(), false, m - (arena.board.getSize() + 1 - n)));
                    arena.board.chess(m, n, BLANK);
                    temp.push(score);
                }
            }
            util.sort(temp, arena.rest, !(role === BLACK));
        }

        search(arena, role, depth, alpha, beta) {
            if(depth === 0 || arena.gameover()[0]) {
                return [arena.score, util.tail(arena.used)];
            }
            this.rearrange(arena, role);
            var best;
            var rest = util.copy(arena.rest);
            var width = (this.width < util.length(rest)) ? this.width : util.length(rest);
            for(var i = 0; i < width; ++i) {
                var [x, y] = rest[i];
                arena.board.chess(x, y, role);
                arena.used.push([x, y]);
                util.remove(arena.rest, [x, y]);
                var temp = arena.score;
                arena.score = arena.evaluate();
                if(role === BLACK) {
                    var [score, position] = this.search(arena, WHITE, depth - 1, alpha, beta);
                    if(alpha < score) {
                        alpha = score;
                        best = [x, y];
                    }
                }
                else {
                    var [score, position] = this.search(arena, BLACK, depth - 1, alpha, beta);
                    if(beta > score) {
                        beta = score;
                        best = [x, y];
                    }
                }
                arena.score = temp;
                arena.board.chess(x, y, BLANK);
                arena.used.pop();
                arena.rest = util.copy(rest);
                if(alpha >= beta) {
                    return (role === BLACK) ? [alpha, best] : [beta, best];
                }
            }
            return (role === BLACK) ? [alpha, best] : [beta, best];
        }

        move(arena) {
            return this.search(arena, this.role, this.depth, NINF, INF)[1];
        }
    }

    class Arena {
        constructor(role) {
            this.board = new Board(SIZE);
            this.robot = new Robot((role === BLACK) ? WHITE : BLACK, WIDTH, DEPTH);
            this.role = role;
            this.score = 0;
            this.used = [];
            this.rest = [];
            for(var i = 0; i < this.board.getSize(); ++i) {
                for(var j = 0; j < this.board.getSize(); ++j) {
                    this.rest.push([i + 1, j + 1]);
                }
            }
        }

        initialize() {
            if(this.role !== BLACK) {
                var temp = (this.board.getSize() & 1) ? (this.board.getSize() + 1) / 2 : this.board.getSize() / 2;
                this.board.chess(temp, temp, BLACK);
                this.used.push([temp, temp]);
                util.remove(this.rest, [temp, temp]);
                var td = document.getElementById(temp + "_" + temp);
                td.innerHTML = "<img src=\"Gobang.annex/BlackActive.png\" width=\"45\" height=\"45\">";
            }
        }

        gameover() {
            var [x, y] = util.tail(this.used);
            var result = acWin.match(this.board.getBoard()[x]);
            if(result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            result = acWin.match(util.vertical(this.board.getBoard(), y));
            if(result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            result = acWin.match(util.diagonal(this.board.getBoard(), true, x - y));
            if(result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            result = acWin.match(util.diagonal(this.board.getBoard(), false, x - (this.board.getSize() + 1 - y)));
            if(result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            if(util.length(this.rest) === 0) {
                return [true, 0];
            }
            return [false, 0];
        }

        evaluate() {
            var [x, y] = util.tail(this.used);
            var temp = this.board.getBoard()[x][y];
            var score = 0;
            this.board.chess(x, y, BLANK);
            score -= acScore.match(this.board.getBoard()[x]);
            score -= acScore.match(util.vertical(this.board.getBoard(), y));
            score -= acScore.match(util.diagonal(this.board.getBoard(), true, x - y));
            score -= acScore.match(util.diagonal(this.board.getBoard(), false, x - (this.board.getSize() + 1 - y)));
            this.board.chess(x, y, temp);
            score += acScore.match(this.board.getBoard()[x]);
            score += acScore.match(util.vertical(this.board.getBoard(), y));
            score += acScore.match(util.diagonal(this.board.getBoard(), true, x - y));
            score += acScore.match(util.diagonal(this.board.getBoard(), false, x - (this.board.getSize() + 1 - y)));
            return this.score + score;
        }

        run(x, y) {
            this.board.chess(x, y, this.role);
            this.used.push([x, y]);
            util.remove(this.rest, [x, y]);
            this.score = this.evaluate();
            var result = this.gameover();
            if(result[0]) {
                return result;
            }
            var [m, n] = this.robot.move(this);
            var td = document.getElementById(m + "_" + n);
            if(this.robot.getRole() === BLACK) {
                td.innerHTML = "<img src=\"Gobang.annex/BlackActive.png\" width=\"45\" height=\"45\">";
                var [a, b] = util.tail(this.used);
                var temp = document.getElementById(a + "_" + b);
                temp.innerHTML = "<img src=\"Gobang.annex/White.png\" width=\"45\" height=\"45\">";
            }
            else {
                td.innerHTML = "<img src=\"Gobang.annex/WhiteActive.png\" width=\"45\" height=\"45\">";
                var [a, b] = util.tail(this.used);
                var temp = document.getElementById(a + "_" + b);
                temp.innerHTML = "<img src=\"Gobang.annex/Black.png\" width=\"45\" height=\"45\">";
            }
            this.board.chess(m, n, this.robot.getRole());
            this.used.push([m, n]);
            util.remove(this.rest, [m, n]);
            this.score = this.evaluate();
            return this.gameover();
        }
    }

    var arena = new Arena((argument === "firstHand") ? BLACK : WHITE);

    var consider = false;
    var gameover = false;
    for(var i = 0; i < SIZE; ++i) {
        var tr = document.createElement("tr");
        tr.style.display = "block";
        tr.style.alignSelf = "center";
        for(var j = 0; j < SIZE; ++j) {
            var td = document.createElement("td");
            td.id = (i + 1) + "_" + (j + 1);
            if((i + 1 === 4 && (j + 1 === 4 || j + 1 === 12)) || (i + 1 === 8 && j + 1 === 8) || (i + 1 === 12 && (j + 1 === 4 || j + 1 === 12))) {
                td.innerHTML = "<img src=\"Gobang.annex/BlankPoint.png\" width=\"45\" height=\"45\">";
            }
            else {
                td.innerHTML = "<img src=\"Gobang.annex/Blank.png\" width=\"45\" height=\"45\">";
            }
            tr.append(td);
        }
        board.append(tr);
    }
    board.onclick = (event) => {
        if(event.target.parentNode.id.includes("_")) {
            var x = Number(event.target.parentNode.id.split("_")[0]);
            var y = Number(event.target.parentNode.id.split("_")[1]);
            if(!consider && !gameover && event.target.parentNode.innerHTML.includes("Blank")) {
                if(arena.role === BLACK) {
                    event.target.parentNode.innerHTML = "<img src=\"Gobang.annex/BlackActive.png\" width=\"45\" height=\"45\">";
                    if(util.length(arena.used)) {
                        var [a, b] = util.tail(arena.used);
                        var temp = document.getElementById(a + "_" + b);
                        temp.innerHTML = "<img src=\"Gobang.annex/White.png\" width=\"45\" height=\"45\">";
                    }
                }
                else {
                    event.target.parentNode.innerHTML = "<img src=\"Gobang.annex/WhiteActive.png\" width=\"45\" height=\"45\">";
                    var [a, b] = util.tail(arena.used);
                    var temp = document.getElementById(a + "_" + b);
                    temp.innerHTML = "<img src=\"Gobang.annex/Black.png\" width=\"45\" height=\"45\">";
                }
                setTimeout(() => {
                    consider = true;
                    var temp = arena.run(x, y);
                    consider = false;
                    if(temp[0]) {
                        gameover = true;
                        setTimeout(() => {
                            if(temp[0]) {
                                if(temp[1] === BLACK) {
                                    alert("Black win");
                                }
                                else if(temp[1] === WHITE) {
                                    alert("White win");
                                }
                                else {
                                    alert("Draw");
                                }
                            }
                        }, 500);
                    }
                }, 0);
            }
        }
    };
    arena.initialize();
}
