
var canvas = document.querySelector('canvas');
var img = document.querySelector('img');
var ctx = canvas.getContext('2d');
var count = 400;
var DISTANCE = 150;  //默认最远距离

window.onload = function () {
	var w = canvas.width = document.documentElement.getBoundingClientRect(img, null).width;
	var h = canvas.height = document.documentElement.getBoundingClientRect(img, null).height;
	var dotArr = dotInit();
	run(dotArr);
}

function randNum(max, min) {
	min = min || 0;
	max = max || 0;
	rand = Math.ceil(Math.random() * (max - min) + min);
	if (!!rand) {
		return rand;
	}
	return randNum(max, min);
}

function dotInit() {
	var dotArr = [];
	for (var i = 1; i < count; i++) {
		var dot = new Dot();
		dot.init();
		dotArr.push(dot);
	}
	return dotArr;
}
function initMouseDot(dotArr, x, y) {
	var dot = new Dot({x: x, y: y, r: 2});
	dotArr[0] = dot;
	return dot;
}
function run(dotArr) {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	canvas.addEventListener('click', function (e) {
		for (var i = 1; i < 5; i++) {
			if (dotArr.length > count) {
				dotArr.splice(1, 1);
			}
			var dot = new Dot({
				x: e.pageX,
				y: e.pageY
			})
			dot.init();
			dotArr.push(dot);
		}
	})
	canvas.addEventListener('mousemove', function (e) {
		initMouseDot(dotArr, e.pageX, e.pageY);
	})



	var len = dotArr.length;
	for (var i = 0; i < len - 1; i++) {
		for (var j = i + 1; j < len; j++) {

			var d1 = dotArr[i], d2 = dotArr[j];
			var dis = dotDistance(d1, d2);

			if (dis < DISTANCE) {
				ctx.strokeStyle = 'rgba(0, 0, 0,' + (1 - dis / DISTANCE).toFixed(2) + ')';
				ctx.beginPath();
				ctx.moveTo(d1.x, d1.y);
				ctx.lineTo(d2.x, d2.y);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
	dotArr = dotArr.filter(function (dot, index) {
		dot.update();
		if (!index) {
			return true;
		}
		return !(dot.x > dot.maxX || dot.y > dot.maxY || dot.x < 0 || dot.maxy < 0);
	})
	for (var i = 0; i < count; i++) {
		if (!dotArr[i]) {
			dotArr.push(new Dot());
		}
		dotArr[i].init();
	}


	window.requestAnimationFrame(run.bind(this, dotArr));
}

function dotDistance(d1, d2) {
	return Math.sqrt(Math.pow(d1.x - d2.x, 2) + Math.pow(d1.y - d2.y, 2));
}
