import audioSrc from '../assets/audio/02.mp3'

const start = (sketch) => {
  let myShaders
  let audio
  let canvas
  let amp, fft

  let isShaderLoaded = false
  let isAudioLoaded = false
  let isReady = false

  const togglePlay = () => {
    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const onShaderLoaded = () => {
    isShaderLoaded = true
  }
  const onAudioLoader = () => {
    isAudioLoaded = true
  }

  const initDom = () => {
    const isInitDom = !isReady && isShaderLoaded && isAudioLoaded
    if (isInitDom) {
      isReady = true
      const titleDom = document.getElementById('title')
      const loadingDom = document.querySelector('.loading')

      loadingDom.style.opacity = '0'
      setTimeout(() => {
        loadingDom.style.display = 'none'
        titleDom.style.opacity = '1'
      }, 1000)
    }
  }

  sketch.preload = () => {
    const vertex = new URL('./shaders/vertex.glsl', import.meta.url)
    const fragment = new URL('./shaders/fragment.glsl', import.meta.url)

    myShaders = loadShader(vertex, fragment, onShaderLoaded)
    audio = loadSound(audioSrc, onAudioLoader)
  }

  sketch.setup = () => {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.mouseClicked(togglePlay)

    shader(myShaders)

    amp = new p5.Amplitude()
    fft = new p5.FFT()
  }

  sketch.draw = () => {
    initDom()

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
