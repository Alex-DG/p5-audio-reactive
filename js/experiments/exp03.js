import audioSrc from '../assets/audio/03.mp3'

const start = (sketch) => {
  const bins = 64

  let audio
  let fft
  let peakDetect
  let bgColor = 0

  const togglePlay = () => {
    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const peakDetected = () => {
    console.log('Peak Detected!')
    bgColor = color(random(255), random(255), random(255))
  }

  sketch.preload = function () {
    audio = loadSound(audioSrc)
  }

  sketch.setup = function () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.mouseClicked(togglePlay)

    fft = new p5.FFT()

    // Config specific to this audio track
    // Frequency ranges
    // bass = [20, 140]
    // lowMid = [140, 400]
    // mid = [400, 2600]
    // highMid = [2600, 5200]
    // treble = [5200, 14000]
    peakDetect = new p5.PeakDetect(140, 400, 0.8)
    peakDetect.onPeak(peakDetected)
  }

  sketch.draw = function () {
    background(bgColor)
    noStroke()

    fft.analyze(bins)

    peakDetect.update(fft)
  }

  sketch.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
