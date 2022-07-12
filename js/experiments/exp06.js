import audioSrc from '../assets/audio/01.mp3'

const start = (sketch) => {
  let myShaders
  let audio
  let canvas
  let amp, fft

  const togglePlay = () => {
    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  sketch.preload = () => {
    const vertex = new URL('./shaders/vertex.glsl', import.meta.url)
    const fragment = new URL('./shaders/fragment.glsl', import.meta.url)

    myShaders = loadShader(vertex, fragment)
    audio = loadSound(audioSrc)
  }

  sketch.setup = () => {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.mouseClicked(togglePlay)

    shader(myShaders)

    amp = new p5.Amplitude()
    fft = new p5.FFT()
  }

  sketch.draw = () => {
    background(0)

    fft.analyze()

    const volume = amp.getLevel() // 0 to 1
    // const freq = fft.getEnergy('highMid') // 0 to 255
    let freq = fft.getCentroid() // 0 to 255
    freq *= 0.001

    const mapF = map(freq, 0, 1, 0, 20)
    const mapA = map(volume, 0, 0.2, 0, 0.5)

    myShaders.setUniform('uTime', frameCount)
    myShaders.setUniform('uFrequency', mapF)
    myShaders.setUniform('uAmp', mapA)

    sphere(width / 4, 200, 200)
  }

  sketch.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
