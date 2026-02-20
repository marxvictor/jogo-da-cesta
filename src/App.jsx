import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { Physics, usePlane, useSphere, useBox } from "@react-three/cannon";
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import texturaBola from '../src/assets/textura-de-papel-branco.jpg';
import texturaChão from '../src/assets/grama.jpg';
import modeloCesta from '../src/assets/Shopping_Basket.GLTF';


function Model({ url, position, scale, rotation }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
}

function Plane(props) {
  const texture = useLoader(TextureLoader, texturaChão);
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Ball() {
  const texture = useLoader(TextureLoader, texturaBola);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 5, 0], 
    args: [0.2],
  }));

  const shootBall = () => {
    api.position.set(0, 5, 0);
    api.velocity.set(
      Math.random() * 2 - 1, // X (-1 a 1)
      -2,                   // Y (para baixo)
      -8                    // Z (para frente)
    );
  };

  return (
    <mesh ref={ref} onClick={shootBall} castShadow>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function TrashCan() {
  
  const [ref] = useBox(() => ({
    args: [3, 2.7, 0.5],      // Largura, Altura, Profundidade
    position: [0, 1, -5.8], // Posição Y é metade da altura
    rotation: [-0.2, 0, 0],
    type: "Static",
  }));

  const [refR] = useBox(() => ({
    args: [0.5, 2.7, 2],      // Largura, Altura, Profundidade
    position: [1.2, 1, -5], // Posição Y é metade da altura
    rotation: [0, 0, -0.2],
    type: "Static",
  }));

  const [refL] = useBox(() => ({
    args: [0.5, 2.7, 2],      // Largura, Altura, Profundidade
    position: [-1.2, 1, -5], // Posição Y é metade da altura
    rotation: [0, 0, 0.2],
    type: "Static",
  }));

  const [refF] = useBox(() => ({
    args: [3, 2.7, 0.5],      // Largura, Altura, Profundidade
    position: [0, 1, -4.2], // Posição Y é metade da altura
    rotation: [0.2, 0, 0],
    type: "Static",
  }));

  const [refB] = useBox(() => ({
    args: [3, 0.5, 2],      // Largura, Altura, Profundidade
    position: [0, 0.3, -5], // Posição Y é metade da altura
    type: "Static",
  }));

  return (
    <group>

      <mesh ref={ref} visible={true}/>
      <mesh ref={refR} visible={true}/>
      <mesh ref={refL} visible={true}/>
      <mesh ref={refF} visible={true}/>
      <mesh ref={refB} visible={true}/>
      
      <Model 
        url={modeloCesta} 
        position={[0, 0, -5]}
        scale={[5, 5, 5]}    
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function App() {
  
  useGLTF.preload(modeloCesta);
  
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Stars />
      <OrbitControls />
      <Physics gravity={[0, -9.8, 0]}>
        <Plane />
        <Ball />
        <TrashCan />
      </Physics>
    </Canvas>
  );
}