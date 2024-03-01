float PI = 3.1415926535897932384626433832795;
precision highp float;

uniform float time;
uniform float uLevel;
varying vec2 vUv;
varying vec3 vWorldPosition;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec3 pallete(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 a = vec3(0.5, 0.5, 0.5);
vec3 b = vec3(0.5, 0.5, 0.5);
vec3 c = vec3(1.0, 1.0, 1.0);
vec3 d = vec3(0.0, 0.10, 0.20);

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a)
  mat2 m = mat2(c, s, -s, c);
  return m * v;
}

void main() {
  vec2 uv = rotate(vUv - vec2(0.5), uLevel * PI * 2.);

  float scene = mix(sdCircle(uv, 0.2), sdBox(uv, vec2(0.2)), 3. * (sin(uLevel * PI * 2.0) + 1.) * 5.5);

  float dd = scene;

  vec3 col = vec3(1.);
  col *= 1.0 - exp(-6.0 * abs(dd * 6.));

  vec3 color = pallete(fract(uLevel) * 2., a, b, c, d);

  if(scene < 0.0) {
    discard;
  }

  gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.0), 1.0);
  gl_FragColor = vec4(col + color * 0.6, 1.);

  float dist = length(cameraPosition - vWorldPosition);
  float fade = smoothstep(14., 7., dist);
  gl_FragColor.rgb *= fade;
}