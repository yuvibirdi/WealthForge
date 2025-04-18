/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 cityboyjj.glb --transform --types 
Files: cityboyjj.glb [8.85MB] > /Users/user/Desktop/Projects/wealthforge/public/cityboyjj-transformed.glb [446.38KB] (95%)
*/

import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'
import { useGLTF } from '@react-three/drei'

type GLTFAction = THREE.AnimationClip

type GLTFResult = GLTF & {
  nodes: {
    SketchfabCity_PolygonMiniCity_01_0: THREE.Mesh
    SketchfabCity_PolygonMiniCity_01_Blue_0: THREE.Mesh
    SketchfabCity_Water_0: THREE.Mesh
  }
  materials: {
    PolygonMiniCity_01: THREE.MeshStandardMaterial
    PolygonMiniCity_01_Blue: THREE.MeshStandardMaterial
    Water: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/cityboyjj-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.SketchfabCity_PolygonMiniCity_01_0.geometry} material={materials.PolygonMiniCity_01} position={[3.653, -0.178, -2.635]} />
      <mesh geometry={nodes.SketchfabCity_PolygonMiniCity_01_Blue_0.geometry} material={materials.PolygonMiniCity_01_Blue} position={[3.653, -0.178, -2.635]} />
      <mesh geometry={nodes.SketchfabCity_Water_0.geometry} material={materials.Water} position={[3.653, -0.178, -2.635]} />
    </group>
  )
}

useGLTF.preload('/models/cityboyjj-transformed.glb')
