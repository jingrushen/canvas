var videoPlayer = function (option) {

    this.player = null;
    this.controls = null;
    this.slidepro = null;
    this.slidevoice = null;
    this.source = [];
    config(option, this);

    this.play_turn = getDom(this.controls, '#video-play-turn');
    this.replay = getDom(this.controls, '#video-replay');
    this.duration = getDom(this.controls, '#video-duration');
    this.curtime = getDom(this.controls, '#video-curtime');
    this.fullSrn = getDom(this.controls, '#video-fullScreen');

    this.curr = 0;
    this.timer = null;
    var _this = this;

    this.listener();
    this.slidepro.listener();
    this.slidevoice.listener();

////////////////初始化数据////////////////////
    this.player.src = this.source[this.curr];
    this.player.volume = 0.5;

    document.onwebkitfullscreenchange = function () {
        var fsl = document.fullscreenElement
            || document.mozFullscreenElement
            || document.webkitFullscreenElement;
        if (fsl) {
            _this.fullSrn.value = 'small';
            _this.player.onclick = function (e) {
                var e = event || window.event;
                console.log(e.target);
            }
        } else {
            _this.fullSrn.value = 'expand';
        }
    }
}

/**
 * 全屏api
 * document.fullscreenElement: 返回null或者正处于全屏的对象
 * document.documentElement.requestFullscreen(): 全屏函数
 * document.exitFullscreen(): 退出全屏函数
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
videoPlayer.prototype.toggleFullScreen = function (ele) {
    var fse = document.fullscreenElement
        || document.mozFullScreenElement
        || document.webkitFullscreenElement
        || document.msFullscreenElement;

    if (!fse) {
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        } else if (ele.oRequestFullscreen) {
            ele.oRequestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullScreen();
        } else {
            alert('你的浏览器不支持全屏模式');
            return ;
        }
    } else {
        if (document.exitFullscreen) {
            document.ExitFullscreen();
        } else if (document.mozExitFullScreen) {
            document.mozExitFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.oExitFullscreen) {
            document.oExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            alert('你的浏览器不支持全屏模式');
            return ;
        }               
    }
 }



videoPlayer.prototype.listener = function () {

    var _this = this;

    //属性：duration视频的播放总时长 
    //方法：loadedmetadata元数据加载完成后执行事件
    this.player.onloadedmetadata = function () {
        _this.duration.innerHTML = '/ ' + _this.slidepro.TimeFormat(parseInt(_this.player.duration));
        _this.player.currentTime = 0;
    }

    //属性：paused判断是否暂停/played判断是否播放 
    //方法：play()播放/pause()暂停
    this.play_turn.onclick = function () {
        if (_this.player.paused) {
            _this.player.play();
            _this.setTimer();
            _this.play_turn.classList.remove('glyphicon-play');
            _this.play_turn.classList.add('glyphicon-pause');
            //_this.play_turn.value = 'paus';
        } else {
            _this.player.pause();
            //_this.play_turn.value = 'play';
            _this.play_turn.classList.add('glyphicon-play');
            _this.play_turn.classList.remove('glyphicon-pause');
            _this.clearTimer();
        }
    }
    this.replay.onclick = function () {
        _this.clearTimer();
        _this.player.currentTime = 0;
        _this.setTimer();
    }

    //监听全屏
    this.player.addEventListener('dblclick', function () {
        _this.toggleFullScreen(_this.player);
     }, false);
    //video.requestFullScreen() 全屏显示
    //video.exitFullScreen() 退出全屏
    //事件：fullscreenchange 全屏状态切换时，触发事件
    //fullscreenElement 返回当前处于全屏状态的节点dom，没有则返回null
    this.fullSrn.onclick = function () {
        _this.toggleFullScreen(_this.player);
    }


}
videoPlayer.prototype.lis = function () {
    console.log('click');
}


videoPlayer.prototype.clearTimer =  function() {
    clearInterval(this.timer);
}

//属性：currentTime已经播放的秒数
videoPlayer.prototype.setTimer = function () {
    var _this = this;
    this.timer = setInterval(function () {
        //_this.curtime.innerHTML = _this.slidepro.TimeFormat(parseInt(curt));
        if ('/ ' + _this.curtime.innerHTML === _this.duration.innerHTML) {
            //_this.play_turn.value = 'play';
            _this.play_turn.classList.add('glyphicon-play');
            _this.play_turn.classList.remove('glyphicon-pause');
            _this.clearTimer();
            setTimeout(function (){
                _this.player.src = _this.source[++_this.curr] || _this.source[_this.curr = 0];
            },1000)
        }
    }, 250);           
}
