varying vec2 vUv;

uniform float uTime;

float aastep(float threshold, float value) {
  #ifdef GL_OES_standard_derivatives
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
  #else
    return step(threshold, value);
  #endif  
}

void main() {  
  // 棋盘着色
  // vec3 color1 = vec3(0.0, 1.0, 0.0);
  // vec3 color2 = vec3(0.0, 0.0, 0.0);

  // vec3 mask1 = vec3(step(0.5, fract(vUv.x * 3.0)));
  // vec3 mask2 = vec3(step(0.5, fract(vUv.y * 3.0)));
  // vec3 mixer = abs(mask1 - mask2);
  // vec3 color = mix(color1, color2, mixer);

  // float strength = distance(vUv, vec2(0.5)) - 0.2;
  // float strength = step(0.2, distance(vUv, vec2(0.5)));

  // 圆圈
  // float strength = aastep(0.01, abs(distance(vUv, vec2(0.5)) - 0.2));

  // vec3 color = vec3(1.0 - strength);

  // 平滑渐变
  // float strength = smoothstep(0.0, 1.0, vUv.x);
  // vec3 color = vec3(strength);

  // 竖向横条渐变
  // 0 - 0.2纯黑色
  /**
    0 / 6 -- 1 / 6  都为0 / 5
    1 / 6 -- 2 / 6  都为1 / 5
    2 / 6 -- 3 / 6  都为2 / 5
    3 / 6 -- 4 / 6  都为3 / 5
    4 / 6 -- 5 / 6  都为4 / 5
    5 / 6 -- 6 / 6  都为5 / 5
  */
  float strength = (vUv.x) / 5.0;
  vec3 color = vec3(strength);

  gl_FragColor = vec4(color, 1.0);
}
