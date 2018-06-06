/**
 * 进度条组件
 * 外边显示条outpro
 * 内部进度条inpro
 * 拖拉按钮btn
 */


/**
 * btn: 拖拉的按钮
 * outpro： 外部进度条
 * inpro： 实际进度条
 * player：音频 | 视频 | 音量元素
 * curtime：显示当前播放时间的节点
 */
var slideProgress = function (option) {

	this.player = null;
	this.outpro = null;
	this.cofig = '' || 'VIDEO';
	this.curtime = null;
	this.voice_turn = null;
	config(option, this);
	
	this.btn = getDom(this.outpro, '#handle');
	this.inpro = getDom(this.outpro, '#progress');


	this.minLen = 0;
	this.maxLen = this.outpro.offsetWidth - this.btn.offsetWidth;
	this.initLeft = parseInt(this.btn.getBoundingClientRect().left + 10);
	this.isDrag = false;
	this.procur;
	this.voicecur;
	this.to;

}
slideProgress.prototype.listener = function () {
	var _this = this;
	this.btn.onmousedown = function (e1) {
		_this.isDrag = true;
		_this.disX = e1.clientX - _this.btn.offsetLeft;
		if (_this.isDrag) {
			document.onmousemove = function (e2) {
				_this.to = Math.max(_this.minLen, Math.min(_this.maxLen, e2.clientX - _this.disX));

				_this.btn.style.left = _this.to + 'px';
				_this.inpro.style.width = _this.to + 'px';



				//////////设置视频的currentTime 和 显示当前时间 | 设置音量的volume
				if (_this.cofig === 'VIDEO') {
					_this.procur = parseInt(_this.player.duration * _this.to / _this.maxLen);
					_this.player.currentTime = _this.procur;
					//_this.curtime.innerHTML = _this.TimeFormat(curt);
				} else if (_this.cofig === 'VOICE') {
					_this.voicecur = (_this.to / _this.outpro.offsetWidth).toFixed(3);
					_this.player.volume = _this.voicecur;
				}


				///////这一步是关键，取消冒泡行为和默认行为，
				///浏览器会对元素做默认的drag行为，
				///会导致元素脱离，不会触发mouseup事件
				e2.stopPropagation();
				e2.preventDefault();
			}	
			document.onmouseup = function(e3) {
				if (_this.isDrag) {
					_this.isDrag = false;
					console.log('mouseup');
				}
				document.onmousemove = null;
				e3.stopPropagation();
			}
		} 
	}
	this.outpro.onclick = function (e4) {
		if (!_this.isDrag) {
			console.log('click');
			_this.to = Math.max(_this.minLen, Math.min(_this.maxLen, e4.clientX - _this.initLeft))
			/*_this.btn.style.left = to + 'px';
			_this.inpro.style.width = to + 'px';*/
			if (_this.cofig === 'VIDEO') {
				_this.procur = parseInt(_this.player.duration * _this.to / _this.maxLen);
		        _this.player.currentTime = _this.procur;
		       // _this.curtime.innerHTML = _this.TimeFormat(curt);
			} else if (_this.cofig === 'VOICE') {
				_this.voicecur = (_this.to / _this.outpro.offsetWidth).toFixed(3);
				_this.player.volume = _this.voicecur;
			}
		}
	}

	if (this.cofig === 'VOICE') {
		this.voice_turn.onclick = function () {
			var opacity;
			if (_this.player.muted) {
				_this.player.muted = false;
				//_this.voice_turn.value = 'clos';
				opacity = 1;
			} else {
				_this.player.muted = true;
				//_this.voice_turn.value = 'open';
				opacity = 0.5;
			}
			_this.btn.style.opacity = opacity;
			_this.inpro.style.opacity = opacity;
		}
	}


	if (this.cofig === 'VIDEO') {
		//////////////监听当前时间的变化/////////////////
		this.player.ontimeupdate = function () {
			_this.curtime.innerHTML = _this.TimeFormat(parseInt(_this.player.currentTime));
	        if (!_this.isDrag) {
	            _this.timeWprogress(parseInt(_this.player.currentTime));
	        }
		}
	}
	//////////////监听当前音量的变化//////////////////
	this.player.onvolumechange = function () {
		_this.btn.style.left = _this.player.volume * _this.maxLen + 'px';
		_this.inpro.style.width = _this.player.volume * _this.maxLen + 'px';
		if (_this.player.volume > 0.5 && !_this.player.muted) {
			_this.voice_turn.className = 'glyphicon glyphicon-volume-up'; 
		} else if (_this.player.volume === 0 || _this.player.muted) {
			_this.voice_turn.className = 'glyphicon glyphicon-volume-off';
		} else if (_this.player.volume < 0.5 && !_this.player.muted) {
			_this.voice_turn.className = 'glyphicon glyphicon-volume-down';
		}
	}
}
slideProgress.prototype.timeWprogress = function (curt) {
        var to = curt / parseInt(this.player.duration) * this.maxLen;
        this.btn.style.left = to + 'px';
        this.inpro.style.width = to + 'px';	
}
slideProgress.prototype.TimeFormat = function (time) {
	var t = {
		h: parseInt(time / 60 / 60),
	    m: parseInt(time / 60 % 60),
	    s: parseInt(time % 60)
	}
	t.h = t.h < 10? '0' + t.h : t.h;
	t.m = t.m < 10? '0' + t.m : t.m;
	t.s = t.s < 10? '0' + t.s : t.s;
	return t.h + ':' + t.m + ':' + t.s;
}
/**
 * 注意要素：
 * 执行视频的currentTime属性与显示时间相互绑定在一起，
 * ontimeupdate() 当video.currentTime发生改变的时候回触发
 * 要变一起变的原则，这样就不会出现bug啦
 */