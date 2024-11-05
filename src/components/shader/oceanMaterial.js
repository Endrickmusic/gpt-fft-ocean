const oceanShader = {
  vertexShader: `
    uniform sampler2D heightField;
    uniform float uTime;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vec3 pos = position;
      float height = texture2D(heightField, uv).r;
      pos += normal * height;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    uniform samplerCube envMap;
    uniform float fresnelPower;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), fresnelPower);
      vec3 reflection = textureCube(envMap, reflect(viewDir, vNormal)).rgb;
      vec3 baseColor = vec3(0.1, 0.3, 0.5);
      gl_FragColor = vec4(mix(baseColor, reflection, fresnel), 1.0);
    }
  `,
}

export default oceanShader
