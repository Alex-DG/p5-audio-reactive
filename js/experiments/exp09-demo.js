import audioSrc from '../assets/audio/02.mp3'

const start = (sketch) => {
  let myShaders
  let audio
  let canvas
  let amp
  let fft
  let beatDetect
  let bgColor = 0

  let words = [
    'melt',
    'fear',
    'bounce',
    'rabid',
    'fuzzy',
    'gratis',
    'sense',
    'madly',
    'yellow',
    'crazy',
    'ahead',
    'super',
    'classy',
    'craven',
    'sassy',
    'roomy',
    'sedate',
    'gaudy',
    'moldy',
    'groovy',
  ]

  const texts = [...document.querySelectorAll('.text span')]

  let isShaderLoaded = false
  let isAudioLoaded = false
  let isReady = false

  const togglePlay = () => {
    if (audio.isPlaying()) {
      audio.pause()
      document.getElementById('title').style.opacity = '1'
    } else {
      audio.play()
      document.getElementById('title').style.opacity = '0'
    }
  }

  const triggerBeat = () => {
    bgColor = color(random(255), random(255), random(255))

    texts.forEach((el, i) => {
      setTimeout(() => {
        el.innerHTML = random(words)
      }, random(200) * i)
    })
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
      const textDom = document.querySelector('.text')
      const loadingDom = document.querySelector('.loading')

      loadingDom.style.opacity = '0'
      setTimeout(() => {
        loadingDom.style.display = 'none'
        titleDom.style.opacity = '1'
        textDom.style.opacity = '1'
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

    amp = new p5.Amplitude()
    fft = new p5.FFT()

    beatDetect = new p5.PeakDetect(20, 20000, 0.2)
    beatDetect.onPeak(triggerBeat)

    shader(myShaders)
  }

  sketch.draw = () => {
    initDom()

    background(bgColor)

    fft.analyze()
    beatDetect.update(fft)

    const volume = amp.getLevel() // 0 - 1

    // Spectral Centroid Frequency of the spectral centroid in Hz.
    let freq = fft.getCentroid()
    freq *= 0.001

    const mapCentroid = map(freq, 0, 5, -1, 1)
    const mapFreq = map(fft.getEnergy('mid'), 0, 100, 0, 0.1)

    const rotation = map(audio.currentTime(), 0, audio.duration(), 0, 0.001)

    myShaders.setUniform('uAmplitude', mapCentroid)
    myShaders.setUniform('uFrequency', mapFreq)

    myShaders.setUniform('uTime', frameCount * 0.001)

    rotateY(frameCount * rotation)

    // Maybe try to control the size of the sphere with the volume?
    sphere(width / 8, 50, 50)
  }

  sketch.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
