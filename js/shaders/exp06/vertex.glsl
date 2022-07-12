precision mediump float;

uniform float uTime;
uniform float uFrequency;
uniform float uAmp;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

attribute vec3 aPosition;
attribute vec3 aNormal;

varying vec3 vNormal;

void main() {
  vec4 newPosition = vec4(aPosition, 1.0);

  float frequency = uFrequency;
  float amplitude = uAmp;

  float displacement = sin(newPosition.z * frequency + uTime * 0.1);
  newPosition.z += displacement * aNormal.z * amplitude;

  gl_Position = uProjectionMatrix * uModelViewMatrix * newPosition;

  vNormal = aNormal;
}