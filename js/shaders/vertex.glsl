precision mediump float;

attribute vec3 aPosition;

void main() {
  vec3 newPosition = aPosition;

  newPosition.xy = newPosition.xy * 2.0 - 1.0; // scale full screen

  gl_Position = vec4(newPosition, 1.0);
}