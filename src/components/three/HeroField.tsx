'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COLS = 64
const ROWS = 40
const GAP = 0.46
const N = COLS * ROWS
const PN = 280 // drifting atmosphere particles

function WaveField() {
  const pointsRef = useRef<THREE.Points>(null)
  const dustRef = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const { camera, gl } = useThree()

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Grid geometry data
  const { positions, colors, grid } = useMemo(() => {
    const positions = new Float32Array(N * 3)
    const colors = new Float32Array(N * 3)
    const grid: [number, number][] = []
    let idx = 0
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const x = (i - COLS / 2) * GAP
        const z = (j - ROWS / 2) * GAP
        positions[idx * 3] = x
        positions[idx * 3 + 1] = 0
        positions[idx * 3 + 2] = z
        grid.push([x, z])
        idx++
      }
    }
    return { positions, colors, grid }
  }, [])

  const dustPositions = useMemo(() => {
    const dpos = new Float32Array(PN * 3)
    for (let i = 0; i < PN; i++) {
      dpos[i * 3] = (Math.random() - 0.5) * 26
      dpos[i * 3 + 1] = Math.random() * 9
      dpos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2
    }
    return dpos
  }, [])

  const cLow = useMemo(() => new THREE.Color(0x24398f), [])
  const cHigh = useMemo(() => new THREE.Color(0x2563eb), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  // Pointer parallax relative to the canvas
  const onMove = (e: React.PointerEvent) => {
    const r = gl.domElement.getBoundingClientRect()
    mouse.current.tx = (e.clientX - r.left) / r.width - 0.5
    mouse.current.ty = (e.clientY - r.top) / r.height - 0.5
  }
  // attach once
  useMemo(() => {
    gl.domElement.addEventListener('pointermove', onMove as unknown as EventListener)
    return () => gl.domElement.removeEventListener('pointermove', onMove as unknown as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl])

  useFrame((state) => {
    const t = reduce ? 0 : state.clock.elapsedTime
    const pts = pointsRef.current
    if (pts) {
      const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute
      const colAttr = pts.geometry.attributes.color as THREE.BufferAttribute
      for (let k = 0; k < N; k++) {
        const x = grid[k][0]
        const z = grid[k][1]
        const y =
          Math.sin(x * 0.55 + t * 0.9) * 0.45 +
          Math.cos(z * 0.5 - t * 0.7) * 0.4 +
          Math.sin((x + z) * 0.3 + t * 0.5) * 0.25
        posAttr.array[k * 3 + 1] = y
        const h = (y + 1.1) / 2.2
        tmp.copy(cLow).lerp(cHigh, Math.pow(Math.max(0, Math.min(1, h)), 2.2))
        colAttr.array[k * 3] = tmp.r
        colAttr.array[k * 3 + 1] = tmp.g
        colAttr.array[k * 3 + 2] = tmp.b
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
    }

    const dust = dustRef.current
    if (dust) {
      const dAttr = dust.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < PN; i++) {
        dAttr.array[i * 3 + 1] += 0.006 + (reduce ? 0 : 0.004)
        if (dAttr.array[i * 3 + 1] > 9) dAttr.array[i * 3 + 1] = -1
      }
      dAttr.needsUpdate = true
      dust.rotation.y = t * 0.02
    }

    // mouse-eased parallax
    const m = mouse.current
    m.x += (m.tx - m.x) * 0.05
    m.y += (m.ty - m.y) * 0.05
    if (pts) {
      pts.rotation.y = m.x * 0.3
      pts.rotation.x = m.y * 0.12
    }
    camera.position.x = m.x * 1.4
    camera.position.y = 2.6 - m.y * 0.8
    camera.lookAt(0, 0.2, 0)
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={N} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} count={N} />
        </bufferGeometry>
        <pointsMaterial size={0.055} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
      </points>

      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} count={PN} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={0x2563eb} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
    </>
  )
}

export default function HeroField() {
  return (
    <Canvas
      camera={{ position: [0, 2.6, 9.5], fov: 58, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2(0x000615, 0.085)
      }}
    >
      <WaveField />
    </Canvas>
  )
}
