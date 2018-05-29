function inherit(superClass, subClass) {
	var proto = subClass.prototype;
	var F = function() {}
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	var key;
	for (key in proto) {
		subClass.prototype[key] = proto[key];
	}
	subClass.prototype.constructor = subClass;
}
function getDom(ele, selector, all) {
	if (all) {
		return ele.querySelectorAll(selector);
	}
	return ele.querySelector(selector);
}
function getStyle(attr, ele) {
	if (document.documentElement.getBoundingClientRect) {
		return ele.getBoundingClientRect()[attr];
	} else {
		return ele.currentStyle[attr];
	}
}
var colorConvert = {
	hsv2rbg: function (h, s, v) {
		var r, g, b;

		var i = Math.floor(h / 60),
			f = h / 60 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);

	    switch (i % 6) {
	        case 0:
	            r = v, g = t, b = p;
	            break;
	        case 1:
	            r = q, g = v, b = p;
	            break;
	        case 2:
	            r = p, g = v, b = t;
	            break;
	        case 3:
	            r = p, g = q, b = v;
	            break;
	        case 4:
	            r = t, g = p, b = v;
	            break;
	        case 5:
	            r = v, g = p, b = q;
	            break;
	    }

	    return {
	    	r: parseInt(r * 255),
	    	g: parseInt(g * 255),
	    	b: parseInt(b * 255)
	    }
	},

	rgb2hsv: function (r, g, b) {
	    r /= 255, g /= 255, b /= 255;

	    var max = Math.max(r, g, b),
	        min = Math.min(r, g, b);
	    var h, s, v;
	    v = max;

	    var d = max - min;
	    s = max == 0 ? 0 : d / max;

	    if (max == min) {
	        h = 0;
	    } else {
	        switch (max) {
	            case r:
	                h = 60 * ((g - b) / d + (g < b ? 6 : 0));
	                break;
	            case g:
	                h = 60 * ((b - r) / d + 2);
	                break;
	            case b:
	                h = 60 * ((r - g) / d + 4);
	                break;
	        }
	    }

	    return {
	    	h: parseInt(h),
	    	s: s.toFixed(2),
	    	v: v.toFixed(2)
	    }
	},

	hsl2rgb: function (h, s, l) {
	    h /= 360;

	    var r, g, b;

	    if (s == 0) {
	        r = g = b = l; // achromatic
	    } else {
	        function hue2rgb(p, q, t) {
	            if (t < 0) t += 1;
	            if (t > 1) t -= 1;
	            if (t < 1 / 6) return p + (q - p) * 6 * t;
	            if (t < 1 / 2) return q;
	            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;

	        r = hue2rgb(p, q, h + 1 / 3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1 / 3);
	    }	

	    return {
	    	r: parseInt(r * 255),
	    	g: parseInt(g * 255),
	    	b: parseInt(b * 255)
	    }	
	},

	rgb2hsl: function (r, g, b) {
	    r /= 255, g /= 255, b /= 255;

	    var max = Math.max(r, g, b),
	        min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if (max == min) {
	        h = s = 0; // achromatic
	    } else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	        switch (max) {
	            case r:
	                h = 60 * ((g - b) / d + (g < b ? 6 : 0));
	                break;
	            case g:
	                h = 60 * ((b - r) / d + 2);
	                break;
	            case b:
	                h = 60 * ((r - g) / d + 4);
	                break;
	        }
	    }

	    return {
	    	h: parseInt(h),
	    	s: s.toFixed(2),
	    	l: l.toFixed(2)
	    }
	},

	hsv2hsl: function (h, s, v) {
		var rgb = this.hsv2rbg(h, s, v);
		return this.rgb2hsl(rgb.r, rgb.g, rgb.b);
	},

	hsl2hsv: function (h, s, l) {
		var rgb = this.hsl2rgb(h, s, l);
		return this.rgb2hsv(rgb.r, rgb.g, rgb.b);
	}
}

var DecimalConvert = {
	d2h: function (value) {
		var hArr = [], a = ['A', 'B', 'C', 'D', 'E', 'F'];
		if (value === 0) {
			hArr.unshift(0);
		}
		while (value !== 0) {
			var mol = value % 16;
			mol = mol - 9 > 0? a[mol - 10] : mol;
			hArr.unshift(mol);
			value = parseInt(value / 16);
		}

		////////////////////////////
		//////////应用于颜色十进制转换成十六进制 //
		/////////////////////////s///
		if (hArr.length < 2) {
			hArr.unshift(0);
		}

		return hArr.join('');
	},
	h2d: function (value) {
		var hArr = value.split(/(\d\d)|(\w\w)/).filter(h => !!h).map(h => parseInt(h, 16));
		return {
			r: hArr[0],
			g: hArr[1],
			b: hArr[2]
		}
	}

}

var COLOR_PICKER = function () {

	//初始化数值
	var curHSV = { h: 0, s: 1, v: 1 },
		curRGB = { r: 255, g: 0, b: 0 },
		curHSL = { h: 0, s: 1, l: 0.5 };
	var renderrgb = colorConvert.hsv2rbg(curHSV.h, 1, 1),
	    rendercolor = 'rgb(' + renderrgb.r + ',' + renderrgb.g + ',' + renderrgb.b + ')';
	var	xdata = DecimalConvert.d2h(curRGB.r) + DecimalConvert.d2h(curRGB.g) + DecimalConvert.d2h(curRGB.b);


	/**
	 * 触发更新的两种方法：
	 * i.  通过拖动取色板或者取色条，通过get方法获取hsv等
	 * ii. 通过改变输入板上的值，通过value方法获取hsv等
	 * 
	 * 更新数据渲染页面：
	 * 获取当前hsv rgb hsl值，
	 * 实时显示input中的值
	 * 实时显示当前颜色
	 * 更新渲染picker-panel
	 * 更新handle的background-color
	 * 更新handle的位置
	 * 
	 */
	function isLegal(data) {
		var key;
		for (key in data) {
			if(isNaN(data[key])){
				return false;
			}
		} 
		return true;
	}
	var updateForData = function () {

	    renderrgb = colorConvert.hsv2rbg(curHSV.h, 1, 1);
	    rendercolor = 'rgb(' + renderrgb.r + ',' + renderrgb.g + ',' + renderrgb.b + ')';
		xdata = DecimalConvert.d2h(curRGB.r) + DecimalConvert.d2h(curRGB.g) + DecimalConvert.d2h(curRGB.b);


		pickerIns.update();
		barIns.update();
		inputIns.update();


	}
	function updatePos() {
		pickerIns.x = curHSV.s * pickerIns.width;
		pickerIns.y = (1 - curHSV.v) * pickerIns.height;
		barIns.y = curHSV.h * barIns.height / 360;
	}	
	function pickByPanel() {

		curHSV = getHSV();
		curRGB = colorConvert.hsv2rbg(curHSV.h, curHSV.s, curHSV.v);
		curHSL = colorConvert.hsv2hsl(curHSV.h, curHSV.s, curHSV.v);

		if (isLegal(curRGB) && isLegal(curHSL)) {
			updateForData();
		}
		return ;

	}
	function pickByRGB() {

		curRGB = {
			r: parseInt(inputIns.rgb.r.value),
			g: parseInt(inputIns.rgb.g.value),
			b: parseInt(inputIns.rgb.b.value)				
		};
		curHSV = colorConvert.rgb2hsv(curRGB.r, curRGB.g, curRGB.b);
		curHSL = colorConvert.rgb2hsl(curRGB.r, curRGB.g, curRGB.b);

		if (isLegal(curHSV) && isLegal(curHSL)) {
			updatePos();
			updateForData();
		}
		return ;
	}
	function pickByHSL() {
		curHSL = {
			h: parseFloat(inputIns.hslv.h.value),
			s: parseFloat(inputIns.hslv.s.value),
			l: parseFloat(inputIns.hslv.l.value)
		};
		curHSV = colorConvert.hsl2hsv(curHSL.h, curHSL.s, curHSL.l);
		curRGB = colorConvert.hsl2rgb(curHSL.h, curHSL.s, curHSL.l);
		if (isLegal(curHSV) && isLegal(curRGB)) {
			updatePos();
			updateForData();
		}
		return ;
	}
	function pickByH() {
		curRGB = DecimalConvert.h2d(inputIns.xdata.value);
		curHSV = colorConvert.rgb2hsv(curRGB.r, curRGB.g, curRGB.b);
		curHSL = colorConvert.rgb2hsl(curRGB.r, curRGB.g, curRGB.b);
		if (isLegal(curHSV) && isLegal(curHSL)) {
			updatePos();
			updateForData();
		}
		return;
	}
	//通过当前坐标获取HSV
	function getHSV() {
		var h = barIns.y * 360 / barIns.height,
			s = pickerIns.x * 1 / pickerIns.width,
			v = 1 - ( pickerIns.y * 1 / pickerIns.height );
		return {
			h: parseInt(h) === 360? 0 : parseInt(h),
			s: s.toFixed(2),
			v: v.toFixed(2)
		}
	}

	/**
	 * 取色器，取色条父类
	 * 监听元素，获取dom节点
	 */
	var ColorPicker = function (options) {
		if (!options) { return ; }
		this.picker = document.querySelector(options.picker);
		this.canPicker = getDom(this.picker, options.canvas);
		this.handle = getDom(this.picker, options.handle);
		this.ctxPicker = this.canPicker.getContext('2d');
		this.width = getStyle('width', this.canPicker);
		this.height = getStyle('height', this.canPicker);
		this.x = this.width || 0;
		this.y = 0;
	}



	ColorPicker.prototype.listener = function (t, hasX) {
		var _t = t;
		hasX = arguments[1] !== undefined? hasX : true;

		function lis(e) {

			_t.oldPos = {
				x: e.clientX,
				y: e.clientY
			}
			_t.startPos = {
				x: _t.x,
				y: _t.y
			}
			var fun = function (e) {
				_t.hmove.call(_t, e, hasX);
			}

			document.addEventListener('mousemove', fun);
			document.addEventListener('mouseup', function () {
				document.removeEventListener('mousemove', fun);
			})
		}

		t.handle.addEventListener('mousedown', function (e) {

			lis(e);

		})

		t.canPicker.addEventListener('mousedown', function (e) {
			
			_t.x = e.offsetX;
			_t.y = e.offsetY;

			pickByPanel();	

			lis(e);


		})

	}
	ColorPicker.prototype.hmove = function(e, hasX) {
		this.diff = {
			x: e.clientX - this.oldPos.x,
			y: e.clientY - this.oldPos.y
		}

		this.x = Math.max(0, Math.min(this.startPos.x + this.diff.x, this.width));
		this.y = Math.max(0, Math.min(this.startPos.y + this.diff.y, this.height));

		pickByPanel();

	}


	//创建取色板的实例
	var pickerIns = (function (options) {

		var PickerPanel = function (options) {
			ColorPicker.call(this, options);
		}

		PickerPanel.prototype.init = function () {
			this.render(rendercolor);
			this.listener(this, true);
			return this;
		}

		PickerPanel.prototype.update = function () {
			this.handle.style.left = this.x + 'px';
			this.handle.style.top = this.y + 'px';
			this.handle.style.background = '#' + xdata;
			this.render(rendercolor);
		}


		PickerPanel.prototype.render = function (color) {

			var lightLinear = this.ctxPicker.createLinearGradient(0, 0, 0, this.height);
			lightLinear.addColorStop(0, 'rgba(0, 0, 0, 0)');
			lightLinear.addColorStop(1, 'rgba(0, 0, 0, 1)');

			var colorLinear = this.ctxPicker.createLinearGradient(0, 0, this.width, 0);
			colorLinear.addColorStop(0, 'rgba(255, 255, 255, 1)');
			colorLinear.addColorStop(1, color);

			this.ctxPicker.fillStyle = colorLinear;
			this.ctxPicker.fillRect(0, 0, this.width, this.height);
			this.ctxPicker.fillStyle = lightLinear;
			this.ctxPicker.fillRect(0, 0, this.width, this.height);
			
		}


		inherit(ColorPicker, PickerPanel);

		return new PickerPanel(options).init();
	}({
		picker: '.colorpicker',
		canvas: '#selectColor',
		handle: '#main-handle',
	}));


	//创建取色条实例
	var barIns = (function (options) {

		var BarPanel = function (options) {
			ColorPicker.call(this, options);
		}
		BarPanel.prototype.init = function () {
			this.render();
			this.listener(this, false);
			return this;
		}

		BarPanel.prototype.update = function () {
			this.handle.style.top = this.y + 'px';
			this.handle.style.background = rendercolor;			
		}

		BarPanel.prototype.render = function () {

			var dragLinear = this.ctxPicker.createLinearGradient(0, 0, 0, this.height);
			dragLinear.addColorStop(0, '#ff0000');
			dragLinear.addColorStop(0.167, '#ffff00');
			dragLinear.addColorStop(0.334, '#00ff00');
			dragLinear.addColorStop(0.501, '#00ffff');
			dragLinear.addColorStop(0.668, '#0000ff');
			dragLinear.addColorStop(0.835, '#ff00ff');
			dragLinear.addColorStop(1, '#ff0000');	

			this.ctxPicker.fillStyle = dragLinear;
			this.ctxPicker.fillRect(0, 0, this.width, this.height);

		}

		inherit(ColorPicker, BarPanel);

		return new BarPanel(options).init();
		
	}({
		picker: '.colorpicker',
		canvas: '#dragColor',
		handle: '#drag-handle'
	}));

	//创建输出输入类的实例
	var inputIns = (function (options) {

		var InputPanel = function (options) {
			this.picker = document.querySelector(options.picker);
			this.canvas = getDom(this.picker, '#showColor');
			this.xdata = getDom(this.picker, '[data-id="#"]');
			this.input = getDom(this.picker, '.operate-data');
			this.rgbinput = getDom(this.picker, '.rgbInput', true);
			this.rgb = {
				r: this.rgbinput[0],
				g: this.rgbinput[1],
				b: this.rgbinput[2]
			}
			this.hslinput = getDom(this.picker, '.hslInput', true);
			this.hslv = {
				h: this.hslinput[0],
				s: this.hslinput[1],
				l: this.hslinput[2],
				v: this.hslinput[3]
			}

		}
		InputPanel.prototype.init = function () {
			this.listener();
			return this;
		}

		InputPanel.prototype.listener = function() {

			var _t = this;

			this.input.addEventListener('keyup', function (e) {
				var id = e.target.getAttribute('data-id');
				var value = e.target.value;
				
				_t.dataFormat(e, id, value);

				// updateDataWithInput(id, _t);

			})
			this.input.addEventListener('change', function (e) {
				var value = e.target.value;
				var id = e.target.getAttribute('data-id');
				if (value.length < 1) {
					e.target.value = '0';
				}
				if (id === '#') {
					value = value.replace(/\w+/, function (x) {
						return x.toUpperCase();
					});
					if (/[^0-9A-F]/g.test(value)) {
						value = '000000';
					} else {
						var reg = new RegExp(value.charAt(0), 'g');
						if (value.length == 3 && value.replace(reg, '') == '' ) {
							value += value;
						} else {
							value = value.concat(Array(6 - value.length + 1).join('0'));
						}
					}	
					e.target.value = value;
					pickByH();
				}
			})

		}
		InputPanel.prototype.dataFormat = function(e, id, value) {

			switch (id) {
				case 'R':
				case 'G':
				case 'B':
					value = Number(value);
					if (value > 255) value = 255;
					e.target.value = isNaN(value)? 0 : value;
					pickByRGB();
					break;
				case 'H':
					value = Number(value);
					if (value >= 360) value = 360;
					e.target.value = isNaN(value)? 0 : value;
					pickByHSL();
					break;
				case 'S':
				case 'L':
					value = value.replace(/^[^01]/, '').replace(/([01])\d?(\.)*(\d)?(\d)?.?/, '$1$2$3$4');
					e.target.value = (value * 100) > 100? '1.00' : value;
					if (value.charAt(value.length - 1) !== '.') {
						pickByHSL();
					}
					break;
				default: break;
			}
		}



		InputPanel.prototype.update = function () {

			this.rgb.r.value = Number(curRGB.r);
			this.rgb.g.value = Number(curRGB.g);
			this.rgb.b.value = Number(curRGB.b);
			this.hslv.h.value = Number(curHSL.h);
			this.hslv.s.value = Number(curHSL.s);
			this.hslv.l.value = Number(curHSL.l);
			this.hslv.v.value = Number(curHSV.v);

			this.canvas.style.background = '#' + xdata;
			this.xdata.value = xdata;
		}

		return new InputPanel(options).init();

	}({
		picker: '.colorpicker'
	}));


	return (function() {
		updateForData();
	}())

}

COLOR_PICKER();

