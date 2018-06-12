var Tick = {
  countTicks: 360,
  currData: [],
  tickLen: 15,
  PI: 360,
  padding: 50,
  maxRadius: 350,
  minRadius: 250,
  init: function () {
    this.canvas = document.querySelector('.canvas')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.rx = this.width / 2
    this.ry = this.height / 2
    this.radius = this.width / 3
    this.perdeg = this.duration / this.PI
    this.reset()
  },
  renderInnerCircle: function () {
    this.r = (this.width - this.padding * 2) / 3
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#722423'
    this.ctx.arc(this.width / 2, this.height / 2, this.r, 0, 2 * Math.PI)
    this.ctx.stroke()
    this.ctx.closePath()
  },
  renderTick: function () {
    let ticks = this.getTicksPostion()
    for (let i = 0, len = ticks.length; i < len; i++) {
      this.ctx.beginPath()
      let gradient = this.ctx.createLinearGradient(ticks[i].x1, ticks[i].y1, ticks[i].x2, ticks[i].y2)
      gradient.addColorStop(1, '#722423')
      gradient.addColorStop(0.4, '#ab8674')
      gradient.addColorStop(0, '#F5F5F5')
      this.ctx.strokeStyle = gradient
      this.ctx.lineWidth = 2
      this.ctx.moveTo(ticks[i].x1, ticks[i].y1)
      this.ctx.lineTo(ticks[i].x2, ticks[i].y2)
      this.ctx.stroke()
      this.ctx.closePath()
    }
  },
  renderTime (time) {
    let deg = time / this.duration * this.PI
    let a = Math.PI * deg / 180
    this.ctx.fillStyle = '#722423'
    this.ctx.beginPath()
    this.ctx.arc(this.rx + this.r * Math.cos(a), this.ry + this.r * Math.sin(a), 10, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.beginPath()
    this.ctx.lineWidth = 5
    this.ctx.arc(this.rx, this.ry, this.r, 0, a)
    this.ctx.stroke()
    this.ctx.closePath()
  },
  // 通过改变this.radius
  getTicksPostion () {
    let ticks = []
    let radius
    let scale = findMax(this.currData) / 240
    for (let i = 0, len = this.countTicks, angle = 0; i < len; i++) {
      radius = Math.max(Math.min(this.currData[i + 100] + 150, this.maxRadius), this.minRadius)
      let tick = {}
      tick.x1 = this.rx + radius * Math.cos(angle)
      tick.y1 = this.ry + radius * Math.sin(angle)
      tick.x2 = this.rx + (this.radius - this.tickLen) * Math.cos(angle)
      tick.y2 = this.ry + (this.radius - this.tickLen) * Math.sin(angle)
      ticks.push(tick)
      angle += Math.PI / 180
      if (scale > 1) {
        this.canvas.style.transform = `scale(${scale})`
      } else {
        this.canvas.style.transform = `scale(1)`
      }
    }
    return ticks
  },
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  },
  render () {
    this.clear()
    this.renderInnerCircle()
    this.renderTick()
    this.renderTime(this.Time)
  },
  reset () {
    this.clear()
    this.renderInnerCircle()
    this.renderTick()
  }
}
var MusicPlayer = {
  i: 0,
  init: function () {
    let _t = this
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.audio = document.querySelector('audio')
    this.listener()
    this.ctx = new AudioContext()
    this.javascriptNode = this.ctx.createScriptProcessor(2048, 1, 1)
    this.javascriptNode.connect(this.ctx.destination)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.connect(this.javascriptNode)
    this.analyser.smoothingTimeConstant = 0.6;
    this.source = this.ctx.createMediaElementSource(this.audio)
    this.source.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)
    this.analyser.fftSize = 2048
    this.bufferLength = this.analyser.fftSize
    Tick.currData = new Uint8Array(this.bufferLength)
    // Tick.currData = new Float32Array(this.bufferLength)
    this.draw()
    Tick.init()
    Control.init()
  },
  listener () {
    this.audio.addEventListener('timeupdate', (function (e) {
      let time = e.target.currentTime
      Control.update(time)
      Tick.Time = time
    }))
    this.audio.addEventListener('canplay', function () {
      Tick.duration = this.duration
    }),
    this.audio.addEventListener('ended', function () {
      Tick.reset()
      Control.reset()
    })
  },
  draw () {
    if (!this.audio.paused) {
      this.analyser.getByteFrequencyData(Tick.currData)
      // this.analyser.getFloatTimeDomainData(Tick.currData)
      Tick.render()
      if (hasClass(Control.container, 'paused')) {
        Control.container.classList.remove('paused')
      }
    } else {
      if (!hasClass(Control.container, 'paused')) {
        Control.container.classList.add('paused')
      }
    }
    requestAnimationFrame(() => {
      this.draw()
    })
  }
}
var Control = {
  container: document.querySelector('.container'),
  op: document.querySelector('.op'),
  currTime: document.querySelector('.curr-time'),
  init: function () {
    let _t = this
    this.op.addEventListener('click', function () {
      _t.toggleClass('active')
    })
  },
  toggleClass: function (classname) {
    if (hasClass(this.op, classname)) {
      this.op.classList.remove(classname)
      MusicPlayer.audio.pause()
    } else {
      this.op.classList.add(classname)
      MusicPlayer.audio.play()
    }
  },
  update: function(time) {
    this.currTime.innerHTML = formatTime(time)
  },
  reset: function () {
    this.currTime.innerHTML = '00:00'
    this.op.classList.remove('active')
  }
}
var BackGround = {
  bg: document.querySelector('.bg-canvas'),
  init: function () {
    this.width = window.innerWidth,
    this.height = window.innerHeight,
    this.ctx = this.bg.getContext('2d'),
    this.bg.width = this.width
    this.bg.height = this.height
    let gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height)
    gradient.addColorStop(0, '#8d574e')
    gradient.addColorStop(1, 'rgba(110, 25, 14, 0.5)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.fill()
  }
}

function formatData(arr) {
  return arr.map((item) => {
    return item + 100
  })
}
function findMax(arr) {
  return arr.reduce((a, b) => {
    return Math.max(a,b)
  })
}
function getRandom (min, max) {
  return Math.random() * (max - min) + min | 0
}
function hasClass (el, classname) {
  let classNames = el.className.split(/\s+/)
  return classNames.some((item) => {
    if (item === classname) {
      return true
    }
  })
}
function formatTime(time) {
  let s = parseInt(time) % 60 | 0
  let m = parseInt(time) / 60 | 0
  return `${addZero(m)}:${addZero(s)}`
}
function addZero(num) {
  if (num < 10) {
    num = '0' + num
  }
  return num;
}

MusicPlayer.init()
BackGround.init()