precision mediump float;

varying vec2 vTexCoord;
varying vec3 vNormal;
uniform float uTime;
varying float vNoise;

float PI = 3.14159265358979323846264;

// https://iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  vec3 color = vec3(vTexCoord.y * 1.2, vTexCoord.y * 1.2501, vTexCoord.y * 1.312);
  
  float diffuse = 0.004 * max(dot(vTexCoord, vec2(10.0)), 21.0);
  color = pow(color, vec3(8.0 * vNoise));


  gl_FragColor = vec4(color * diffuse, 1.0);
}
