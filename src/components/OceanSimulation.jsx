import { useFrame, useThree } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from "three"
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"
import heightShader from "./shader/heightShader.js"
import oceanMaterialShader from "./shader/oceanMaterial.js"

function OceanSimulation({ environmentMap }) {
  const { gl } = useThree()

  // Set up GPUComputationRenderer for heightfield
  const gpuCompute = useMemo(
    () => new GPUComputationRenderer(128, 128, gl),
    [gl]
  )

  const heightTexture = gpuCompute.createTexture()
  const heightVar = gpuCompute.addVariable(
    "heightField",
    heightShader,
    heightTexture
  )

  gpuCompute.setVariableDependencies(heightVar, [heightVar])
  const error = gpuCompute.init()
  if (error !== null) {
    console.error(error)
  }

  // Initialize the heightfield texture before first use
  gpuCompute.compute()

  // Create custom ShaderMaterial for ocean
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          envMap: { value: environmentMap },
          heightField: { value: null },
          fresnelPower: { value: 3.0 },
        },
        vertexShader: oceanMaterialShader.vertexShader,
        fragmentShader: oceanMaterialShader.fragmentShader,
      }),
    [environmentMap]
  )

  useFrame((_, delta) => {
    gpuCompute.compute()
    material.uniforms.heightField.value =
      gpuCompute.getCurrentRenderTarget(heightVar).texture
    material.uniforms.uTime.value += delta
  })

  return (
    <>
      <mesh
        material={material}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        <planeGeometry args={[5, 5, 128, 128]} />
      </mesh>
      <mesh position={[5, 0, -2]} scale={[2, 2, 2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={gpuCompute.getCurrentRenderTarget(heightVar).texture}
        />
      </mesh>
    </>
  )
}

export default OceanSimulation
