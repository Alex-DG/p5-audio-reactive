precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec2 uTextureResolution;

uniform vec2 uResolution;

uniform float uTime;
uniform float uFrequency;
uniform float uAmp;

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

// void main() {
//   vec3 color = vec3(vTexCoord.y);

//   gl_FragColor = vec4(color, 1.0);
// }

void main() {

  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uTextureResolution.x / uTextureResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uTextureResolution.y / uTextureResolution.x), 1.0)
  );

  vec2 uv = vec2(
    vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  uv.y = 1.0 - uv.y;

  uv -= vec2(0.5);
  uv = scale(vec2(0.91)) * uv;
  uv += vec2(0.5);

  float frequency = uFrequency;
  float amplitude = uAmp;

  float distortion = sin(uv.y * frequency + (uTime * 0.01)) * amplitude;
  // float distortion = sin(uv.x * frequency + (uTime * 0.1)) * amplitude;
  // float distortion = sin(uv.y * frequency + (uTime * 0.2)) * amplitude;

  vec4 texture = texture2D(uTexture, uv + distortion);

  gl_FragColor = texture;
}
