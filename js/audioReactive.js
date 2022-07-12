const start = (sketch) => {
  let myShaders

  sketch.preload = () => {
    const vertex = new URL('./shaders/vertex.glsl', import.meta.url)
    const fragment = new URL('./shaders/fragment.glsl', import.meta.url)

    myShaders = loadShader(vertex, fragment)
  }

  sketch.setup = () => {
    createCanvas(windowWidth, windowHeight, WEBGL)

    shader(myShaders)
  }

  sketch.draw = () => {
    background(0)

    rect(0, 0, width, height)
  }

  sketch.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight)
  }
}

export { start }
