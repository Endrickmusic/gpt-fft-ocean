import { useMemo } from "react"
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"

export default function useGPGPU(gl, width, height) {
  const gpuCompute = useMemo(
    () => new GPUComputationRenderer(width, height, gl),
    [gl]
  )

  const createVariable = (name, shader, initialTexture) => {
    const variable = gpuCompute.addVariable(name, shader, initialTexture)
    gpuCompute.setVariableDependencies(variable, [variable])
    return variable
  }

  const init = () => {
    const error = gpuCompute.init()
    if (error) console.error("GPGPU Init Error:", error)
  }

  const compute = () => {
    gpuCompute.compute()
  }

  const getCurrentRenderTarget = (variable) => {
    return gpuCompute.getCurrentRenderTarget(variable).texture
  }

  return { gpuCompute, createVariable, init, compute, getCurrentRenderTarget }
}
