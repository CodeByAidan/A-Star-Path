let wid, hei, ctx, map, opn = [], clsd = [], start = {x: 1, y: 1, f: 0, g: 0},
    goal = {x: 98, y: 98, f: 0, g: 0}, mw = 100, mh = 100, neighbors, path;

function findNeighbor(arr, n) {
    let a;
    for (let i = 0; i < arr.length; i++) {
        a = arr[i];
        if (n.x === a.x && n.y === a.y) return i;
    }
    return -1;
}

function addNeighbors(cur) {
    let p;
    for (let i = 0; i < neighbors.length; i++) {
        const n = {x: cur.x + neighbors[i].x, y: cur.y + neighbors[i].y, g: 0, h: 0, prt: {x: cur.x, y: cur.y}};
        if (map[n.x][n.y] === 1 || findNeighbor(clsd, n) > -1) continue;
        n.g = cur.g + neighbors[i].c;
        n.h = Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y);
        p = findNeighbor(opn, n);
        if (p > -1 && opn[p].g + opn[p].h <= n.g + n.h) continue;
        opn.push(n);
    }
    opn.sort(function (a, b) {
        return (a.g + a.h) - (b.g + b.h);
    });
}

function createPath() {
    path = [];
    let a, b;
    a = clsd.pop();
    path.push(a);
    while (clsd.length) {
        b = clsd.pop();
        if (b.x !== a.prt.x || b.y !== a.prt.y) continue;
        a = b;
        path.push(a);
    }
}

function solveMap() {
    drawMap();
    if (opn.length < 1) {
        document.body.appendChild(document.createElement("p")).innerHTML = "Impossible!";
        return;
    }
    const cur = opn.splice(0, 1)[0];
    clsd.push(cur);

    if (cur.x === goal.x && cur.y === goal.y) {
        createPath();
        drawMap();
        return;
    }
    addNeighbors(cur);
    requestAnimationFrame(solveMap);
}

function drawMap() {
    let i;
    ctx.fillStyle = "#ee6";
    ctx.fillRect(0, 0, wid, hei);
    for (let j = 0; j < mh; j++) {
        for (i = 0; i < mw; i++) {
            switch (map[i][j]) {
                case 0:
                    continue;
                case 1:
                    ctx.fillStyle = "#990";
                    break;
                case 2:
                    ctx.fillStyle = "#090";
                    break;
                case 3:
                    ctx.fillStyle = "#900";
                    break;
            }
            ctx.fillRect(i, j, 1, 1);
        }
    }

    let a;
    if (path.length) {
        let txt = "Path: " + (path.length - 1) + "<br />[";
        for (i = path.length - 1; i > -1; i--) {
            a = path[i];
            ctx.fillStyle = "#f00";
            ctx.fillRect(a.x, a.y, 1, 1);
            txt += "(" + a.x + ", " + a.y + ") ";
        }
        document.body.appendChild(document.createElement("p")).innerHTML = txt + "]";
        return;
    }
    for (i = 0; i < opn.length; i++) {
        a = opn[i];
        ctx.fillStyle = "#0ff";
        ctx.fillRect(a.x, a.y, 1, 1);
    }
    for (i = 0; i < clsd.length; i++) {
        a = clsd[i];
        ctx.fillStyle = "#0c0";
        ctx.fillRect(a.x, a.y, 1, 1);
    }
}

function createMap() {
    map = new Array(mw);
    for (let i = 0; i < mw; i++) {
        map[i] = new Array(mh);
        for (let j = 0; j < mh; j++) {
            if (!i || !j || i === mw - 1 || j === mh - 1) map[i][j] = 1;
            else {
                if (Math.random() < .3) map[i][j] = 1;
                else map[i][j] = 0;
            }
        }
    }
}

function init() {
    const canvas = document.createElement("canvas");
    wid = hei = 600;
    canvas.id = "cv";
    canvas.width = wid;
    canvas.height = hei;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    neighbors = [
        {x: 1, y: 0, c: 1}, {x: -1, y: 0, c: 1}, {x: 0, y: 1, c: 1}, {x: 0, y: -1, c: 1},
        {x: 1, y: 1, c: 1.4}, {x: 1, y: -1, c: 1.4}, {x: -1, y: 1, c: 1.4}, {x: -1, y: -1, c: 1.4}
    ];
    path = [];
    ctx.scale(6, 6);
    createMap();
    opn.push(start);
    solveMap();
}