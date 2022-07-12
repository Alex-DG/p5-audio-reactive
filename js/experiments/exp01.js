import audioSrc from '../assets/audio/01.mp3'

const start = (sketch) => {
  let audio, amp, fft

  sketch.preload = function () {
    audio = loadSound(audioSrc)
  }

  sketch.setup = function () {
    createCanvas(windowWidth, windowHeight)
    rectMode(CENTER)

    audio.play()

    amp = new p5.Amplitude()
    fft = new p5.FFT()
  }

  sketch.draw = function () {
    background(0)
    stroke(255)
    // translate(0, height / 2)

    const volume = amp.getLevel()
    // const mapW = map(volume, 0, 0.1, 0, 100)
    // rect(0, 0, mapW, mapW)

    // const waveform = audio.getPeaks()
    const waveform = fft.waveform()

    for (let i = 0; i < waveform.length; i++) {
      // line(i, wavefrom[i] * 100, i, wavefrom[i] * -10)
      const x = map(i, 0, waveform.length, 0, width)
      const y = map(waveform[i], -1, 1, 0, height)
      point(x, y)
    }
  }

  sketch.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
