import audioSrc from '../assets/audio/02.mp3'
import imageSrc from '../assets/images/01.jpg'

const start = (sketch) => {
  let myShader
  let audio
  let img
  let canvas
  let amplitude
  let fft
  let beatDetect
  let bgColor = 0

  let isShaderLoaded = false
  let isAudioLoaded = false
  let isImageLoaded = false
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
  }

  const onShaderLoaded = () => {
    isShaderLoaded = true
  }
  const onAudioLoaded = () => {
    isAudioLoaded = true
  }
  const onImageLoaded = () => {
    isImageLoaded = true
  }

  const initDom = () => {
    const isPreloadReady = isShaderLoaded && isAudioLoaded && isImageLoaded
    const isInitDom = !isReady && isPreloadReady
    if (isInitDom) {
      isReady = true
      const titleDom = document.getElementById('title')
      const textDom = document.querySelector('.text')
      const loadingDom = document.querySelector('.loading')

      loadingDom.style.opacity = '0'
      loadingDom.style.display = 'none'
      titleDom.style.opacity = '1'
      textDom.style.opacity = '1'
    }
  }

  sketch.preload = () => {
    const vertex = new URL('./shaders/vertex.glsl', import.meta.url)
    const fragment = new URL('./shaders/fragment.glsl', import.meta.url)

    myShader = loadShader(vertex, fragment, onShaderLoaded)
    audio = loadSound(audioSrc, onAudioLoaded)
    img = loadImage(imageSrc, onImageLoaded)
  }

  sketch.setup = () => {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.mouseClicked(togglePlay)

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()

    beatDetect = new p5.PeakDetect(20, 20000, 0.2)
    beatDetect.onPeak(triggerBeat)

    shader(myShader)

    myShader.setUniform('uTexture', img)
    myShader.setUniform('uResolution', [width, height])
    myShader.setUniform('uTextureResolution', [img.width, img.height])
  }

  sketch.draw = () => {
    initDom()

    background(0)

    // Start FFT
    fft.analyze() // 0 -> 255

    const volume = amplitude.getLevel()
    let freq = fft.getCentroid()
    freq *= 0.001

    const mapA = map(volume, 0, 1, 0, 0.05)
    const mapF = map(freq, 0, 1, 0, 10)

    myShader.setUniform('uTime', frameCount)

    myShader.setUniform('uFrequency', mapF)
    myShader.setUniform('uAmp', mapA)

    rect(0, 0, width, height)
  }

  sketch.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
