// function config(options, obj) {
// 	for (key in options) {
// 		obj[key] = options[key];
// 	}
// 	return obj;
// }
var Dot = function ( {x, y, r} = {} ) {
	this.canvas = canvas;
	this.ctx = ctx;
	this.maxX = this.canvas.width;
	this.maxY = this.canvas.height;


	this.x = x || randNum(0, this.maxX);
	this.y = y || randNum(0, this.maxY);
	this.r = r || randNum(1, 3);
	this.sx = randNum(-100, 100) / 100;
	this.sy = randNum(-100, 100) / 100;

}
Dot.prototype = {
	init: function () {
		var ctx = this.ctx;
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	},
	update: function () {
		this.x = this.x + this.sx;
		this.y = this.y + this.sy;
	}
}
