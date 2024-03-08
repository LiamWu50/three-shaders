varying vec3 vNormal;
varying float vNoise;

vec3 rgb(float r, float g, float b) {
  return vec3(r/255.0, g/255.0, b/255.0);
}

void main() {
  vec3 color1 = rgb(96., 200., 179.);
  vec3 color2 = rgb(27., 80., 145.);
  vec3 color = mix(color1, color2, vNoise);

  gl_FragColor = vec4(color, 1.0);
}
