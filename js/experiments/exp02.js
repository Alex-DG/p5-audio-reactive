import audioSrc from '../assets/audio/02.mp3'

const start = (sketch) => {
  let audio, canvas, fft

  const bins = 16
  let binWidth

  const togglePlay = () => {
    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  sketch.preload = function () {
    audio = loadSound(audioSrc)
  }

  sketch.setup = function () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.mouseClicked(togglePlay)

    fft = new p5.FFT(0, bins)
    binWidth = width / bins
  }

  sketch.draw = function () {
    background(0)
    noStroke()

    const spectrum = fft.analyze()

    for (let i = 0; i < spectrum.length; i++) {
      const amp = spectrum[i]

      const x = i * binWidth
      const y = map(amp, 0, 255, height, 0)

      rect(x, y, binWidth, height - y)
    }
  }

  sketch.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
