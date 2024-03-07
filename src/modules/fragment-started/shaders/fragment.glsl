varying vec2 vUv;

uniform float uTime;

void main() {
  float dist = fract((length(vUv - vec2(0.5)) / 0.707 + uTime * 0.5 ) * 5.0);

  // 半径随时间变化
  float radisu = 0.5;
  vec3 color = vec3(step(radisu, dist));
  gl_FragColor = vec4(color, 1.0);
}
