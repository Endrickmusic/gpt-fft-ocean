const heightShader = `
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float waveHeight = sin(uv.x * 10.0 + uTime) * 0.1 + sin(uv.y * 12.0 + uTime * 0.8) * 0.1;
  gl_FragColor = vec4(waveHeight, 0.0, 0.0, 1.0);
}
`

export default heightShader
