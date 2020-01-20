const canvas = document.getElementById('mycanvas'),
    ctx = canvas.getContext('2d'),
    wa = 2 * Math.PI; //wholeArc

var p = {
    w: window.innerWidth - document.querySelector('.menu').getBoundingClientRect().width,
    h: window.innerHeight + 5,
},
    pri = [], priReady = false, fold = [];

p.cx = p.w / 2;
p.cy = p.h / 2;

canvas.width = p.w;
canvas.height = p.h;

function getInput(item) {
    let res = document.querySelector('#' + item + ' input').value;
    if (res[0] == '#') { return res }
    return Number(res);
}

function getCheck(item) {
    return document.querySelector('#' + item).checked;
}

function add(item, val = .1, fix = 1) {
    let elem = document.querySelector('#' + item.parentElement.id + ' input'),
        elVal = Number(elem.value);
    if (elVal.toString() == 'NaN') { elVal = 0 }
    elem.value = (elVal + val).toFixed(fix);
}

function subtract(item, val = .1, fix = 1) {
    let elem = document.querySelector('#' + item.parentElement.id + ' input'),
        elVal = Number(elem.value);
    if (elVal.toString() == 'NaN') { elVal = 0 }
    let newVal = elVal - val;
    if (newVal < 0) { newVal = 0 }
    elem.value = (newVal).toFixed(fix);
}

function isNumber(event) {
    var key = (event.which) ? event.which : event.keyCode
    if ((key > 47 && key < 58) || key == 46) {
        return true;
    }
    return false;
}

function matchRange() {
    let r = calcRadius(),
        cStep = getInput('c_step'),
        pStep = (wa * cStep) / (getInput('p_step') - .000000000000001);
    let res = ((((r / cStep) * (r / 2) * wa) / pStep) + 1).toFixed(0);
    document.querySelector('#pn_range input').value = res;
}

function matchAuto() {
    if (getCheck('p_auto')) {
        setTimeout(() => {
            matchRange();
        }, 10);
    }
}

function calcRadius() {
    let type = checkRadio('c_fix');
    switch (type) {
        case 1: return p.cx - 10;
        case 2: return Math.sqrt((p.cx * p.cx) + (p.cy * p.cy)) - 10;
        default: return p.cy - 10;
    }
}

function calcSteps() {
    setTimeout(() => {
        let val = getInput("p_move");
        if (Number(val) != NaN) {
            if (Number(val) == 0) { document.querySelector('#p_step input').value = 'infinity'; return }
            document.querySelector('#p_step input').value = ((wa * p.cS) / Number(val)).toFixed(5)
        }
        matchAuto()
    }, 10);
}

function calcMove() {
    setTimeout(() => {
        let val = getInput('p_step');
        if (Number(val) != NaN) {
            if (Number(val) == 0) { document.querySelector('#p_move input').value = 'infinity'; return }
            document.querySelector('#p_move input').value = ((wa * p.cS) / (Number(val) - .000000000000001)).toFixed(5)
        }
        matchAuto()
    }, 10);
}

function fixNumber(item, fix = 1) {
    let val = item.value.replace('.', '#').split('.');
    item.value = Number(val[0].replace('#', '.')).toFixed(fix);
}

function radio(item) {
    let elem = document.querySelectorAll('#' + item.parentElement.parentElement.id + ' input');
    for (let e of elem) {
        if (e.id != item.id) { e.checked = false }
    }
    item.checked = true;
    matchAuto()
}

function checkRadio(item) {
    let elem = document.querySelectorAll('#' + item + ' input');
    for (let i = 0; i < elem.length; i++) {
        if (elem[i].checked == true) { return i }
    }
    return false;
}

function sectionOnOff(item) {
    let types = ['h1', 'h2', 'div', 'span', 'input'];

    function off(type) {
        let elem = document.querySelectorAll('#' + item.parentElement.parentElement.parentElement.id + ' ' + type);
        for (let e of elem) {
            e.className += ' disabled'
        }
    }
    function on(type) {
        let elem = document.querySelectorAll('#' + item.parentElement.parentElement.parentElement.id + ' ' + type);
        for (let e of elem) {
            e.className = e.className.replace(' disabled', '')
        }
    }

    if (item.checked == true) {
        for (let t of types) { on(t) }
    } else {
        for (let t of types) { off(t) }
    }
}

function foldArea(item) {
    let id = item.parentElement.parentElement.id,
        area = document.querySelector('#' + id + ' .fold'),
        h = area.getBoundingClientRect().height;

    if (h > 2) {
        fold.push([id, h]);
        area.style.height = h + "px";
        setTimeout(() => {
            area.style.height = "0px";
            area.style.marginBottom = "-20px";
            area.style.borderBottom = '2px solid var(--color_1)';
        }, 20);
    } else {
        oldH = fold.find(i => i[0] == id);
        area.style.height = oldH[1] + "px";
        area.style.borderBottom = '0px solid var(--color_1)';
        area.style.marginBottom = "0";
        let ind = fold.findIndex(i => i[0] == id);
        fold.splice(ind, 1);
    }
}

function getParams() {
    p.numOf = getInput('pn_range');
    p.c = getCheck('c_s');
    p.cS = getInput('c_step');
    p.cW = getInput('c_width');
    p.cC = getInput('c_color');
    p.m = (wa * p.cS) / (getInput('p_step') - .000000000000001);
    p.pnS = getInput('pn_start');
    p.cr = getCheck('cr_s');
    p.crC = getInput('c_color');
    p.crW = getInput('cr_width');
    p.crS = getInput('cr_size');
    p.ap = getCheck('ap_s');
    p.apS = getInput('ap_size');
    p.apC = getInput('ap_color');
    p.ppS = getInput('pp_size');
    p.ppC = getInput('pp_color');
    p.a = checkRadio('c_fix');
    p.r = calcRadius();
}

function preparePrimeNum() { // liczby pierwze
    function check(num) {
        for (let p of pri) {
            if (p > 1 && num % p == 0) {
                return false
            }
        }
        return true
    }

    function end() {
        document.getElementById('popup').style.display = "none"
        priReady = true;
    }

    document.getElementById('popup').style.display = "inline"
    let startNum = 1;
    if (pri.length > 0) { startNum = pri[pri.length - 1] }
    if (startNum >= p.numOf) { end(); return }

    let ii = startNum,
        calcPriNum = setInterval(() => {
            for (let i = ii; i < ii + 1000; i++) {
                if (check(i)) {
                    pri.push(i)
                }
                if (i == p.numOf) {
                    clearInterval(calcPriNum);
                    end();
                    break
                }
            }
            ii += 1000;
            document.getElementById('progress').style.width = ((ii / p.numOf) * 100).toFixed(0) + "%";
        }, 7);

}

function render() {
    priReady = false;
    getParams();
    preparePrimeNum();

    let wait = setInterval(() => {
        if (priReady) {
            clearInterval(wait)

            ctx.font = '18pt Calibri';
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';

            ctx.beginPath();
            ctx.rect(0, 0, p.w, p.h);
            ctx.fillStyle = 'black';
            ctx.fill();


            if (p.cr) { // krzyzyk
                ctx.lineWidth = p.crW;
                ctx.strokeStyle = p.crC;
                ctx.beginPath();
                ctx.moveTo(p.cx - p.crS, p.cy);
                ctx.lineTo(p.cx + p.crS, p.cy);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(p.cx, p.cy - p.crS);
                ctx.lineTo(p.cx, p.cy + p.crS);
                ctx.stroke();
            }

            if (p.c) { // kolka
                ctx.lineWidth = p.cW;
                ctx.strokeStyle = p.cC;
                for (let i = p.cS; i < p.r; i += p.cS) {
                    ctx.beginPath();
                    ctx.arc(p.cx, p.cy, i, 0, wa, false)
                    ctx.stroke();
                }
            }

            if (p.ap) {
                ctx.fillStyle = p.apC;
                for (let n = 0; n < p.numOf; n++) {
                    let d = n * p.m, c = p.cS, m = 0;
                    while (m + (wa * c) <= d) {
                        m += wa * c;
                        c += p.cS;
                    }
                    if (c > p.r) { break }
                    let r1 = d - m,
                        nc = c * wa,
                        a = (r1 / nc) * wa,
                        x = Math.cos(a - (Math.PI / 2)) * (c),
                        y = Math.sin(a - (Math.PI / 2)) * (c);

                    ctx.beginPath();
                    ctx.arc(p.cx + x, p.cy + y, p.apS, 0, wa, false)
                    ctx.fill();
                }
            }

            var points = [];
            ctx.fillStyle = p.ppC;
            // for (let i = 0; i < pri.length; i++) {
            // }

            function draw(i) {
                let pn = pri[i],
                    d = (pn - p.pnS) * p.m, c = p.cS, m = 0;
                while (m + (wa * c) <= d) {
                    m += (wa * c);
                    c += p.cS;
                }
                if (c > p.r) { return false }
                let r = d - m,
                    nc = (c) * wa,
                    a = (r / nc) * wa,
                    x = Math.cos(a - (Math.PI / 2)) * (c),
                    y = Math.sin(a - (Math.PI / 2)) * (c);

                // points.push([x, y]);

                ctx.beginPath();
                ctx.arc(p.cx + x, p.cy + y, p.ppS, 0, wa, false)
                ctx.fill();

                return true;
            }

            let ii = 0;
            let slowDraw = setInterval(() => {
                for (let i = ii; i < ii + 150; i++) {
                    let goOn = draw(i)
                    if (i == pri.length || !goOn) {
                        clearInterval(slowDraw);
                        break
                    }
                }
                ii += 150;
            }, 10);

            var lines = [];
            ctx.lineWidth = .8;
            ctx.strokeStyle = 'red';
            // function direction(ang) {
            //     let t = 5;
            //     if ((ang < 0 + t || ang > 360 - t)
            //         // || (ang < 30 + t && ang > 30 - t)
            //         || (ang < 60 + t && ang > 60 - t)
            //         // || (ang < 90 + t && ang > 90 - t)
            //         || (ang < 120 + t && ang > 120 - t)) {
            //         return true
            //     }
            //     return false
            // }

            // for (let p1 of points) {
            //     for (let p2 of points) {
            //         let [x1, y1] = p1,
            //             [x2, y2] = p2,
            //             x = x1 - x2,
            //             y = y1 - y2,
            //             dis = (x * x) + (y * y);
            //         if (dis < d * d && x1 != x2 && y1 != y2) {
            //             // ang = (((Math.atan(x / y)) / Math.PI) * 180);
            //             // if (y < 0) { ang += 180 }
            //             // if (x < 0 && y >= 0) { ang += 360 }
            //             // if (direction(ang)) {
            //                 if (lines.some(li => (li[0] == p1 && li[1] == p2) || (li[0] == p2 && li[1] == p1))) {
            //                     continue;
            //                 }
            //                 // lines.push([p1, p2]);

            //                 ctx.beginPath();
            //                 ctx.moveTo(p.cx + x1, p.cy + y1);
            //                 ctx.lineTo(p.cx + x2, p.cy + y2);
            //                 ctx.stroke();
            //             // }
            //         }
            //     }
            // }
        }
    }, 15);
}


sectionOnOff(document.getElementById('cr_s'));
sectionOnOff(document.getElementById('c_s'));
sectionOnOff(document.getElementById('ap_s'));
calcMove();

render();