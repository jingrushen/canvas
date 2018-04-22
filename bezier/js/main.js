
function canvasDraw() {
    var input = document.querySelector('input'),
        box = document.querySelector('.canvasBox'),
        span = document.querySelector('span'),
        btn = document.querySelector('button'),
        ctx1 = document.querySelector('#canvasOne').getContext('2d'),
        ctx2 = document.querySelector('#canvasTwo').getContext('2d');

    var count;
    var pointArr = [];
    var bezierNode = [];
    var isend = false;
    var t = 0;
    var color = ['hsl(0, 0%, 50%)', 'hsl(100, 20%, 60%)', 'hsl(170, 20%, 60%)', 'hsl(270, 20%, 60%)', 'hsl(0, 20%, 60%)'];

    function number() {
        count = parseInt(input.value);
        span.innerHTML = count;
    }

    function isLegalPoint(p) {
        if (pointArr.length > 0) {
            return p.x !== pointArr[pointArr.length - 1].x
                && p.y !== pointArr[pointArr.length - 1].y;
        }
    }

    function reset() {
        ctx1.clearRect(0, 0, 800, 600);
        ctx2.clearRect(0, 0, 800, 600);
        isend = false;
        pointArr = [];
        bezierNode = [];
        t = 0;
    }

    function init() {

        number();
        listener();
    }

    function bezier(arr, t) {
        var x = 0,
            y = 0;
        var n = arr.length - 1;
        arr.forEach(function (p, index) {
            if (!index) {
                x += p.x * Math.pow(1 - t, n - index) * Math.pow(t, index);
                y += p.y * Math.pow(1 - t, n - index) * Math.pow(t, index);
            } else {
                x += factorial(n) / factorial(index) / factorial(n - index) * p.x * Math.pow(1 - t, n - index) * Math.pow(t, index);
                y += factorial(n) / factorial(index) / factorial(n - index) * p.y * Math.pow(1 - t, n - index) * Math.pow(t, index);
            }
        })
        return {
            x: x,
            y: y
        }
    }

    function factorial(n) {
        if (n <= 1) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }

    function drawNodeLine(nodeArr, t, item) {

        var nodes = nodeArr;

        if (nodeArr.length === count) {
            nodeArr.forEach(function (node, index) {
                ctx2.fillStyle = '#696969';
                ctx2.fillText('[' + node.x + ',' + node.y + ']', 15, 25 * (index + 1));
            })
        }
        if (nodes.length === 1) {
            bezierNode.push(nodes[0]);
            bezierNode.forEach(function (node, index) {
                if (index) {
                    ctx2.beginPath();
                    ctx2.strokeStyle = '#af0000';
                    ctx2.moveTo(bezierNode[index - 1].x, bezierNode[index - 1].y);
                    ctx2.lineTo(node.x, node.y);
                    ctx2.stroke();
                }
            })

        }
        nodes.forEach(function (node, index) {
            ctx2.beginPath();
            ctx2.fillStyle = color[item % 6];
            ctx2.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx2.fill();
            if (index) {
                ctx2.beginPath();
                ctx2.strokeStyle = color[item % 6];
                ctx2.moveTo(nodes[index - 1].x, nodes[index - 1].y);
                ctx2.lineTo(node.x, node.y);
                ctx2.stroke();
            }
        })

        if (nodes.length > 1) {
            var nextNode = [];
            for (var i = 0; i < nodes.length - 1; i++) {
                var arr = [
                    {
                        x: nodes[i].x,
                        y: nodes[i].y
                    },
                    {
                        x: nodes[i + 1].x,
                        y: nodes[i + 1].y
                    }
                ];
                nextNode.push(bezier(arr, t));
            }
            item++;
            drawNodeLine(nextNode, t, item);
        }

    }

    function drawAnimation(originode) {
        if (t > 1) {
            return;
        }
        t += 0.01;
        ctx2.clearRect(0, 0, 800, 600);
        var item = 0;
        drawNodeLine(originode, t, item);
        window.requestAnimationFrame(drawAnimation.bind(this, originode, item));
    }

    function move() {
        var num, isDrag = false;
        box.onmousedown = function (e) {
            var pos = {
                x: e.offsetX,
                y: e.offsetY
            }
            pointArr.forEach(function (node, index) {
                if (Math.abs(node.x - pos.x) < 5 && Math.abs(node.y - pos.y) < 5) {
                    isDrag = true;
                    num = index;
                }
            })
            box.onmousemove = function (e1) {
                if (!isDrag) { return; }
                ctx2.clearRect(0, 0, 800, 600);
                pointArr[num].x = e1.offsetX;
                pointArr[num].y = e1.offsetY;
                pointArr.forEach(function (node, index) {
                    ctx2.fillStyle = '#696969';
                    ctx2.fillText('[' + node.x + ',' + node.y + ']', 15, 25 * (index + 1));

                    ctx2.beginPath();
                    ctx2.fillStyle = 'hsl(0, 0%, 50%)';
                    ctx2.arc(node.x, node.y, 3, 0, Math.PI * 2);
                    ctx2.fill();
                    ctx2.closePath();

                    if (index) {
                        ctx2.beginPath();
                        ctx2.strokeStyle = 'hsl(0, 0%, 50%)';
                        ctx2.moveTo(pointArr[index - 1].x, pointArr[index - 1].y);
                        ctx2.lineTo(node.x, node.y);
                        ctx2.stroke();
                        ctx2.closePath();
                    }

                })
                var bn = [];
                for (var i = 0; i < 1; i += 0.01) {
                    bn.push(bezier(pointArr, i));
                    console.log(bn);
                }
                bn.forEach(function (b, index) {
                    if (index) {
                        ctx2.beginPath();
                        ctx2.strokeStyle = 'red';
                        ctx2.moveTo(bn[index - 1].x, bn[index - 1].y);
                        ctx2.lineTo(b.x, b.y);
                        ctx2.closePath();
                        ctx2.stroke();
                    }
                })
            }
            box.onmouseup = function () {
                box.onmousemove = null;
                isDrag = false;
            }
        }

    }

    function listener() {

        box.onclick = function (e) {

            if (!isend) {

                var point = {
                    x: e.offsetX,
                    y: e.offsetY
                };


                var len = pointArr.length;

                //绘制线段
                if (len > 0 && isLegalPoint(point)) {
                    ctx1.strokeStyle = 'hsl(0, 0%, 50%)';
                    ctx1.moveTo(pointArr[len - 1].x, pointArr[len - 1].y);
                    ctx1.lineTo(point.x, point.y);
                    ctx1.stroke();
                    ctx1.closePath();
                }

                ///绘制圆点
                ctx1.beginPath();
                ctx1.fillStyle = 'hsl(0, 0%, 50%)';
                ctx1.fillText('[' + point.x + ',' + point.y + ']', 15, 25 * (len + 1));
                ctx1.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx1.fill();
                ctx1.closePath();

                pointArr.push(point);

                if (pointArr.length >= count) {
                    ctx1.clearRect(0, 0, 800, 600);
                    drawAnimation(pointArr);
                    isend = true;
                    move();
                }
            }



        }

        btn.onclick = function () {
            reset();
        }

        input.onchange = number;
    }

    return init();
}

canvasDraw();