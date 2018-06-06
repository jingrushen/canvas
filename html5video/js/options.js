function $(selector) {
    return document.querySelector(selector);
}
function config(option, obj) {
    for (var key in option) {
        obj[key] = option[key];
    }
}
function getDom(ele, selector) {
    return ele.querySelector(selector);
}
var player = $('#player'),
    controls = $('.controls'),
    video_pro = $('#video-progress'),
    video_voice = $('#video-voice'),
    curtime = $('.time-progress #video-curtime'),
    voice_turn = $('.voice-turn #video-voice-turn');


function initVideoPlayer() {
    var slidepro = new slideProgress({
        player: player,
        outpro: video_pro,
        curtime: curtime,
        cofig: 'VIDEO'
    })
    var slidevoice = new slideProgress({
        player: player,
        outpro: video_voice,
        voice_turn: voice_turn,
        cofig: 'VOICE'
    })

    console.log(slidepro, slidevoice);
    /**
     * player: video元素
     * controls: 控件元素
     * slidepro: 进度条
     * slidevoice: 音量条
     * @type {videoPlayer}
     */
    var videoplay = new videoPlayer({
        player: player,
        controls: controls,
        slidepro: slidepro,
        slidevoice: slidevoice,
        source: ['videos/echo-hereweare.mp4', 'videos/mov_bbb.mp4']
    });
}
initVideoPlayer();