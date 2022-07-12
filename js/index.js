import { start } from './audioReactive'

const initP5 = () => {
  const sketch = window // for single sketch
  window.p5 = p5
  return { sketch, p5 }
}

const { sketch } = initP5()

start(sketch)
