var argument = window.location.search.substring(1);

if (argument === "") {
    var black = document.getElementById("black");
    var white = document.getElementById("white");
    black.removeAttribute("hidden");
    white.removeAttribute("hidden");
    black.onclick = () => {
        window.location.href = "GoBang.html?firstMove";
    };
    white.onclick = () => {
        window.location.href = "GoBang.html?secondMove";
    };
} else if (argument === "firstMove" || argument === "secondMove") {
    // identifier
    const BOUND = 0;
    const BLANK = 1;
    const BLACK = 2;
    const WHITE = 3;

    // argument
    const S           = 4;
    const M           = 8;
    const L           = 12;
    const SIZE        = 15;
    const WIDTH       = 5;
    const DEPTH       = 8; // 8 is faster while 10 is stronger
    const RATIO_BLACK = (argument === "firstMove") ? 1.0 : 0.9;
    const RATIO_WHITE = (argument === "firstMove") ? -0.9 : -1.0;

    // pattern for win
    const PATTERN_WIN = [
        [RATIO_BLACK * 1, BLACK, BLACK, BLACK, BLACK, BLACK], // X X X X X
        [RATIO_WHITE * 1, WHITE, WHITE, WHITE, WHITE, WHITE]  // O O O O O
    ];

    // pattern for score
    const PATTERN_SCORE = [
        [RATIO_BLACK * 1,       BLANK, BLANK, BLACK, BLACK, BLANK, BLANK], // _ _ X X _ _
        [RATIO_BLACK * 1,       BLANK, BLACK, BLANK, BLACK, BLANK],        // _ X _ X _
        [RATIO_BLACK * 1,       BLANK, BLACK, BLANK, BLANK, BLACK, BLANK], // _ X _ _ X _
        [RATIO_BLACK * 4000,    BLANK, BLACK, BLACK, BLACK, BLANK],        // _ X X X _
        [RATIO_BLACK * 4000,    BLANK, BLACK, BLACK, BLANK, BLACK, BLANK], // _ X X _ X _
        [RATIO_BLACK * 4000,    BLANK, BLACK, BLANK, BLACK, BLACK, BLANK], // _ X _ X X _
        [RATIO_BLACK * 5000,    BOUND, BLACK, BLACK, BLACK, BLACK, BLANK], // | X X X X _
        [RATIO_BLACK * 5000,    BLANK, BLACK, BLACK, BLACK, BLACK, BOUND], // _ X X X X |
        [RATIO_BLACK * 5000,    WHITE, BLACK, BLACK, BLACK, BLACK, BLANK], // O X X X X _
        [RATIO_BLACK * 5000,    BLANK, BLACK, BLACK, BLACK, BLACK, WHITE], // _ X X X X O
        [RATIO_BLACK * 5000,    BLACK, BLACK, BLACK, BLANK, BLACK],        // X X X _ X
        [RATIO_BLACK * 5000,    BLACK, BLANK, BLACK, BLACK, BLACK],        // X _ X X X
        [RATIO_BLACK * 5000,    BLACK, BLACK, BLANK, BLACK, BLACK],        // X X _ X X
        [RATIO_BLACK * 9000,    BLANK, BLACK, BLACK, BLACK, BLACK, BLANK], // _ X X X X _
        [RATIO_BLACK * 1000000, BLACK, BLACK, BLACK, BLACK, BLACK],        // X X X X X
        [RATIO_WHITE * 1,       BLANK, BLANK, WHITE, WHITE, BLANK, BLANK], // _ _ O O _ _
        [RATIO_WHITE * 1,       BLANK, WHITE, BLANK, WHITE, BLANK],        // _ O _ O _
        [RATIO_WHITE * 1,       BLANK, WHITE, BLANK, BLANK, WHITE, BLANK], // _ O _ _ O _
        [RATIO_WHITE * 4000,    BLANK, WHITE, WHITE, WHITE, BLANK],        // _ O O O _
        [RATIO_WHITE * 4000,    BLANK, WHITE, WHITE, BLANK, WHITE, BLANK], // _ O O _ O _
        [RATIO_WHITE * 4000,    BLANK, WHITE, BLANK, WHITE, WHITE, BLANK], // _ O _ O O _
        [RATIO_WHITE * 5000,    BOUND, WHITE, WHITE, WHITE, WHITE, BLANK], // | O O O O _
        [RATIO_WHITE * 5000,    BLANK, WHITE, WHITE, WHITE, WHITE, BOUND], // _ O O O O |
        [RATIO_WHITE * 5000,    BLACK, WHITE, WHITE, WHITE, WHITE, BLANK], // X O O O O _
        [RATIO_WHITE * 5000,    BLANK, WHITE, WHITE, WHITE, WHITE, BLACK], // _ O O O O X
        [RATIO_WHITE * 5000,    WHITE, WHITE, WHITE, BLANK, WHITE],        // O O O _ O
        [RATIO_WHITE * 5000,    WHITE, BLANK, WHITE, WHITE, WHITE],        // O _ O O O
        [RATIO_WHITE * 5000,    WHITE, WHITE, BLANK, WHITE, WHITE],        // O O _ O O
        [RATIO_WHITE * 9000,    BLANK, WHITE, WHITE, WHITE, WHITE, BLANK], // _ O O O O _
        [RATIO_WHITE * 1000000, WHITE, WHITE, WHITE, WHITE, WHITE]         // O O O O O
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

        copy(array) {
            return JSON.parse(JSON.stringify(array));
        }

        insert(array, index, item) {
            array.splice(index, 0, item);
        }

        delete(array, index) {
            array.splice(index, 1);
        }

        remove(array, item) {
            this.delete(array, array.findIndex((temp) => {
                return JSON.stringify(temp) === JSON.stringify(item);
            }));
        }

        horizontal(array, x, y) {
            var temp = [];
            var lower = (y - 5 >= 0) ? y - 5 : 0;
            var upper = (y + 5 <= this.length(array) - 1) ? y + 5 : this.length(array) - 1;
            for (var i = lower; i <= upper; ++i) {
                temp.push(array[x][i]);
            }
            return temp;
        }

        vertical(array, x, y) {
            var temp = [];
            var lower = (x - 5 >= 0) ? x - 5 : 0;
            var upper = (x + 5 <= this.length(array) - 1) ? x + 5 : this.length(array) - 1;
            for (var i = lower; i <= upper; ++i) {
                temp.push(array[i][y]);
            }
            return temp;
        }

        diagonal(array, right, x, y) {
            var temp = [];
            if (right) {
                var index = y - x;
                if (index >= 0) {
                    var lower = (x - 5 >= 0) ? x - 5 : 0;
                    var upper = (x + 5 <= this.length(array) - 1 - index) ? x + 5 : this.length(array) - 1 - index;
                    for (var i = lower; i <= upper; ++i) {
                        temp.push(array[i][i + index]);
                    }
                } else {
                    var lower = (x - 5 + index >= 0) ? x - 5 + index : 0;
                    var upper = (x + 5 + index <= this.length(array) - 1 + index) ? x + 5 + index : this.length(array) - 1 + index;
                    for (var i = lower; i <= upper; ++i) {
                        temp.push(array[i - index][i]);
                    }
                }
            } else {
                var index = this.length(array) - 1 - y - x;
                if (index >= 0) {
                    var lower = (x - 5 >= 0) ? x - 5 : 0;
                    var upper = (x + 5 <= this.length(array) - 1 - index) ? x + 5 : this.length(array) - 1 - index;
                    for (var i = lower; i <= upper; ++i) {
                        temp.push(array[i][this.length(array) - 1 - i - index]);
                    }
                } else {
                    var lower = (x - 5 + index >= 0) ? x - 5 + index : 0;
                    var upper = (x + 5 + index <= this.length(array) - 1 + index) ? x + 5 + index : this.length(array) - 1 + index;
                    for (var i = lower; i <= upper; ++i) {
                        temp.push(array[i - index][this.length(array) - 1 - i]);
                    }
                }
            }
            return temp;
        }

        sort(a, b, descend) {
            var bound = this.length(a) - 1;
            var flag = true;
            while (flag) {
                flag = false;
                for (var i = 0; i < bound; ++i) {
                    if (descend) {
                        if (a[i] < a[i + 1]) {
                            flag = true;
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            temp = b[i];
                            b[i] = b[i + 1];
                            b[i + 1] = temp;
                        }
                    } else {
                        if (a[i] > a[i + 1]) {
                            flag = true;
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            temp = b[i];
                            b[i] = b[i + 1];
                            b[i + 1] = temp;
                        }
                    }
                }
                --bound;
            }
        }
    }

    var util = new Util();

    class Queue {
        constructor() {
            this.data = [];
        }

        size() {
            return util.length(this.data);
        }

        empty() {
            return util.empty(this.data);
        }

        head() {
            return util.head(this.data);
        }

        enqueue(item) {
            this.data.push(item);
        }

        dequeue() {
            this.data.shift();
        }
    }

    class Node {
        constructor() {
            this.next = [null, null, null, null];
            this.fail = null;
            this.over = false;
            this.score = 0;
        }
    }

    class AC {
        constructor(patternList) {
            this.root = new Node();
            for (var i = 0; i < util.length(patternList); ++i) {
                var pattern = patternList[i];
                var pointer = this.root;
                for (var j = 1; j < util.length(pattern); ++j) {
                    var index = pattern[j];
                    if (pointer.next[index] === null) {
                        pointer.next[index] = new Node();
                    }
                    pointer = pointer.next[index];
                }
                pointer.over = true;
                pointer.score = pattern[0];
            }
            var pointerQueue = new Queue();
            pointerQueue.enqueue(this.root);
            while (!pointerQueue.empty()) {
                var pointer = pointerQueue.head();
                pointerQueue.dequeue();
                for (var i = 0; i < 4; ++i) {
                    if (pointer.next[i] !== null) {
                        pointerQueue.enqueue(pointer.next[i]);
                        var temp = pointer;
                        while (temp !== null) {
                            if (temp === this.root) {
                                pointer.next[i].fail = this.root;
                                break;
                            }
                            if (temp.fail.next[i] !== null) {
                                pointer.next[i].fail = temp.fail.next[i];
                                break;
                            }
                            temp = temp.fail;
                        }
                    }
                }
            }
        }

        match(target) {
            var score = 0;
            var i = 0;
            var pointer = this.root;
            while (i < util.length(target)) {
                var index = target[i];
                if (pointer.next[index] === null) {
                    pointer = pointer.fail;
                    if (pointer === null) {
                        ++i;
                        pointer = this.root;
                    }
                } else {
                    ++i;
                    pointer = pointer.next[index];
                }
                if (pointer.over) {
                    score += pointer.score;
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
            this.data = [];
            for (var i = 0; i < this.size + 2; ++i) {
                this.data.push([]);
            }
            for (var i = 0; i < this.size + 2; ++i) {
                this.data[0].push(BOUND);
                this.data[this.size + 1].push(BOUND);
            }
            for (var i = 0; i < this.size; ++i) {
                this.data[i + 1].push(BOUND);
                for (var j = 0; j < this.size; ++j) {
                    this.data[i + 1].push(BLANK);
                }
                this.data[i + 1].push(BOUND);
            }
        }

        check(x, y) {
            return this.data[x][y];
        }

        chess(x, y, role) {
            this.data[x][y] = role;
        }
    }

    class Robot {
        constructor(role, width, depth) {
            this.role = role;
            this.width = width;
            this.depth = depth;
            this.start = true;
        }

        neighbor(arena, x, y) {
            for (var i = 1; i <= 2; ++i) {
                for (var j = 0; j < 2 * i; ++j) {
                    var [m, n] = [x - i, y - i + j];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) !== BOUND && arena.board.check(m, n) !== BLANK) {
                        return true;
                    }
                    [m, n] = [x - i + j, y + i];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) !== BOUND && arena.board.check(m, n) !== BLANK) {
                        return true;
                    }
                    [m, n] = [x + i, y + i - j];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) !== BOUND && arena.board.check(m, n) !== BLANK) {
                        return true;
                    }
                    [m, n] = [x + i - j, y - i];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) !== BOUND && arena.board.check(m, n) !== BLANK) {
                        return true;
                    }
                }
            }
            return false;
        }

        rearrange(arena, role) {
            var [x, y] = util.tail(arena.used);
            for (var i = 1; i <= 1; ++i) {
                for (var j = 0; j < 2 * i; ++j) {
                    var [m, n] = [x - i, y - i + j];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) === BLANK) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                    [m, n] = [x - i + j, y + i];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) === BLANK) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                    [m, n] = [x + i, y + i - j];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) === BLANK) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                    [m, n] = [x + i - j, y - i];
                    if (m >= 1 && m <= arena.board.size && n >= 1 && n <= arena.board.size && arena.board.check(m, n) === BLANK) {
                        util.remove(arena.rest, [m, n]);
                        arena.rest.unshift([m, n]);
                    }
                }
            }
            var temp = [];
            for (var i = 0; i < util.length(arena.rest); ++i) {
                var [m, n] = arena.rest[i];
                if (!this.neighbor(arena, m, n)) {
                    temp.push(0);
                } else {
                    var score = 0;
                    arena.board.chess(m, n, role);
                    score += acScore.match(util.horizontal(arena.board.data, m, n));
                    score += acScore.match(util.vertical(arena.board.data, m, n));
                    score += acScore.match(util.diagonal(arena.board.data, true, m, n));
                    score += acScore.match(util.diagonal(arena.board.data, false, m, n));
                    arena.board.chess(m, n, (role === BLACK) ? WHITE : BLACK);
                    score -= acScore.match(util.horizontal(arena.board.data, m, n));
                    score -= acScore.match(util.vertical(arena.board.data, m, n));
                    score -= acScore.match(util.diagonal(arena.board.data, true, m, n));
                    score -= acScore.match(util.diagonal(arena.board.data, false, m, n));
                    arena.board.chess(m, n, BLANK);
                    temp.push(score);
                }
            }
            util.sort(temp, arena.rest, role === BLACK);
        }

        search(arena, role, depth, alpha, beta) {
            if (depth === 0 || arena.gameover()[0]) {
                return [arena.score, util.tail(arena.used)];
            }
            var restBackup = util.copy(arena.rest);
            var best;
            var temp = arena.score;
            var width = (this.width < util.length(arena.rest)) ? this.width : util.length(arena.rest);
            this.rearrange(arena, role);
            for (var i = 0; i < width; ++i) {
                var [x, y] = arena.rest[i];
                arena.board.chess(x, y, role);
                arena.used.push([x, y]);
                util.delete(arena.rest, i);
                arena.score = arena.evaluate();
                if (role === BLACK) {
                    var [score, position] = this.search(arena, WHITE, depth - 1, alpha, beta);
                    if (alpha < score) {
                        alpha = score;
                        best = [x, y];
                    }
                } else {
                    var [score, position] = this.search(arena, BLACK, depth - 1, alpha, beta);
                    if (beta > score) {
                        beta = score;
                        best = [x, y];
                    }
                }
                arena.score = temp;
                util.insert(arena.rest, i, [x, y]);
                arena.used.pop();
                arena.board.chess(x, y, BLANK);
                if (alpha >= beta) {
                    break;
                }
            }
            arena.rest = restBackup;
            return (role === BLACK) ? [alpha, best] : [beta, best];
        }

        move(arena) {
            if (this.start) {
                this.start = false;
                return this.search(arena, this.role, (this.depth & 1) ? (this.depth + 1) / 2 : this.depth / 2, -2147483648, 2147483647)[1];
            } else {
                return this.search(arena, this.role, this.depth, -2147483648, 2147483647)[1];
            }
        }
    }

    class Arena {
        constructor(size, player, width, depth) {
            this.board = new Board(size);
            this.player = player;
            this.robot = new Robot((this.player === BLACK) ? WHITE : BLACK, width, depth);
            this.used = [];
            this.rest = [];
            this.score = 0;
            for (var i = 0; i < this.board.size; ++i) {
                for (var j = 0; j < this.board.size; ++j) {
                    this.rest.push([i + 1, j + 1]);
                }
            }
        }

        initialize() {
            if (this.player !== BLACK) {
                var temp = (this.board.size & 1) ? (this.board.size + 1) / 2 : this.board.size / 2;
                var td = document.getElementById(temp + "_" + temp);
                td.innerHTML = "<img src=\"GoBang.Attachment/BlackActive.svg\" width=\"50\" height=\"50\">";
                this.board.chess(temp, temp, BLACK);
                this.used.push([temp, temp]);
                util.remove(this.rest, [temp, temp]);
                this.score = this.evaluate();
            }
        }

        gameover() {
            var [x, y] = util.tail(this.used);
            var result = acWin.match(util.horizontal(this.board.data, x, y));
            if (result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            result = acWin.match(util.vertical(this.board.data, x, y));
            if (result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            result = acWin.match(util.diagonal(this.board.data, true, x, y));
            if (result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            result = acWin.match(util.diagonal(this.board.data, false, x, y));
            if (result !== 0) {
                return (result > 0) ? [true, BLACK] : [true, WHITE];
            }
            if (util.length(this.rest) === 0) {
                return [true, 0];
            }
            return [false, 0];
        }

        evaluate() {
            var [x, y] = util.tail(this.used);
            var temp = this.board.check(x, y);
            var score = 0;
            this.board.chess(x, y, BLANK);
            score -= acScore.match(util.horizontal(this.board.data, x, y));
            score -= acScore.match(util.vertical(this.board.data, x, y));
            score -= acScore.match(util.diagonal(this.board.data, true, x, y));
            score -= acScore.match(util.diagonal(this.board.data, false, x, y));
            this.board.chess(x, y, temp);
            score += acScore.match(util.horizontal(this.board.data, x, y));
            score += acScore.match(util.vertical(this.board.data, x, y));
            score += acScore.match(util.diagonal(this.board.data, true, x, y));
            score += acScore.match(util.diagonal(this.board.data, false, x, y));
            return this.score + score;
        }

        run(x, y) {
            this.board.chess(x, y, this.player);
            this.used.push([x, y]);
            util.remove(this.rest, [x, y]);
            this.score = this.evaluate();
            var result = this.gameover();
            if (result[0]) {
                return result;
            }
            var [m, n] = this.robot.move(this);
            var td = document.getElementById(m + "_" + n);
            if (this.robot.role === BLACK) {
                td.innerHTML = "<img src=\"GoBang.Attachment/BlackActive.svg\" width=\"50\" height=\"50\">";
                var [a, b] = util.tail(this.used);
                var temp = document.getElementById(a + "_" + b);
                temp.innerHTML = "<img src=\"GoBang.Attachment/White.svg\" width=\"50\" height=\"50\">";
            } else {
                td.innerHTML = "<img src=\"GoBang.Attachment/WhiteActive.svg\" width=\"50\" height=\"50\">";
                var [a, b] = util.tail(this.used);
                var temp = document.getElementById(a + "_" + b);
                temp.innerHTML = "<img src=\"GoBang.Attachment/Black.svg\" width=\"50\" height=\"50\">";
            }
            this.board.chess(m, n, this.robot.role);
            this.used.push([m, n]);
            util.remove(this.rest, [m, n]);
            this.score = this.evaluate();
            return this.gameover();
        }
    }

    var arena = new Arena(SIZE, (argument === "firstMove") ? BLACK : WHITE, WIDTH, DEPTH);

    // ########## MAIN ########## //
    var board = document.getElementById("board");
    var slogan = document.getElementById("slogan");
    board.removeAttribute("hidden");
    slogan.removeAttribute("hidden");
    for (var i = 0; i < SIZE; ++i) {
        var tr = document.createElement("tr");
        tr.style.display = "block";
        for (var j = 0; j < SIZE; ++j) {
            var td = document.createElement("td");
            td.id = (i + 1) + "_" + (j + 1);
            if ((i + 1 === S && (j + 1 === S || j + 1 === L)) || (i + 1 === M && j + 1 === M) || (i + 1 === L && (j + 1 === S || j + 1 === L))) {
                td.innerHTML = "<img src=\"GoBang.Attachment/BlankPoint.svg\" width=\"50\" height=\"50\">";
            } else {
                td.innerHTML = "<img src=\"GoBang.Attachment/Blank.svg\" width=\"50\" height=\"50\">";
            }
            tr.append(td);
        }
        board.append(tr);
    }
    arena.initialize();
    var consider = false;
    var gameover = false;
    board.onclick = (event) => {
        if (event.target.parentNode.id.includes("_") && event.target.parentNode.innerHTML.includes("Blank") && !consider && !gameover) {
            var [x, y] = event.target.parentNode.id.split("_");
            [x, y] = [Number(x), Number(y)];
            if (arena.player === BLACK) {
                event.target.parentNode.innerHTML = "<img src=\"GoBang.Attachment/BlackActive.svg\" width=\"50\" height=\"50\">";
                if (util.length(arena.used)) {
                    var [a, b] = util.tail(arena.used);
                    var temp = document.getElementById(a + "_" + b);
                    temp.innerHTML = "<img src=\"GoBang.Attachment/White.svg\" width=\"50\" height=\"50\">";
                }
            } else {
                event.target.parentNode.innerHTML = "<img src=\"GoBang.Attachment/WhiteActive.svg\" width=\"50\" height=\"50\">";
                if (util.length(arena.used)) {
                    var [a, b] = util.tail(arena.used);
                    var temp = document.getElementById(a + "_" + b);
                    temp.innerHTML = "<img src=\"GoBang.Attachment/Black.svg\" width=\"50\" height=\"50\">";
                }
            }
            consider = true;
            setTimeout(() => {
                var result = arena.run(x, y);
                if (result[0]) {
                    gameover = true;
                    setTimeout(() => {
                        if (result[1] === BLACK) {
                            alert("Black win");
                        } else if (result[1] === WHITE) {
                            alert("White win");
                        } else {
                            alert("Draw");
                        }
                    }, 500);
                }
                consider = false;
            }, 500);
        }
    };
    // ########## MAIN ########## //
} else {
    var warning = document.getElementById("warning");
    warning.removeAttribute("hidden");
}
