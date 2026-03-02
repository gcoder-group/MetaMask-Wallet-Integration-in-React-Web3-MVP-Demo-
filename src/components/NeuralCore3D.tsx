import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";

const AnimatedCore = () => {
    const sphereRef = useRef<any>(null);

    useFrame(({ clock }) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
            sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.4}>
            <MeshDistortMaterial
                color="#a855f7"
                attach="material"
                distort={0.4} // Strength of distortion
                speed={1.5} // Speed of distortion
                roughness={0.2}
                metalness={0.8}
                emissive="#581c87"
                emissiveIntensity={0.5}
            />
        </Sphere>
    );
};

const NeuralCore3D = () => {
    return (
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={1} />
                <AnimatedCore />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default NeuralCore3D;
