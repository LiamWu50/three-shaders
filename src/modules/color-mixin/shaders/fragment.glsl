varying vec2 vUv;

uniform float uTime;

void main() {
  
  vec3 color1 = vec3(1.0, 1.0, 0.0);
  vec3 color2 = vec3(0.0, 1.0, 1.0);

  // float mixer = fract(vUv.y * 5.0);
  // 渐变
  // vec3 color = mix(color1, color2, mixer);
  // 突变
  // vec3 color = mix(color1, color2, step(0.5, mixer));

  // 圆圈
  // float mixer = length(fract(vUv * 3.0) - vec2(0.5));
  // mixer = step(0.25, mixer);
  // vec3 color = mix(color1, color2, mixer);

  // 对角线渐变
  float mixer1 = vUv.x + vUv.y;
  float mixer2 = 2.0 - (vUv.x + vUv.y);
  float mixer = min(mixer1, mixer2);
  vec3 color = mix(color1, color2, mixer);

  gl_FragColor = vec4(color, 1.0);
}
