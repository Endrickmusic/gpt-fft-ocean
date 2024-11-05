import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import OceanSimulation from "./components/OceanSimulation"

function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Environment files="/hdris/envmap.hdr" background />
        <OceanSimulation />
      </Suspense>
    </Canvas>
  )
}

export default App
