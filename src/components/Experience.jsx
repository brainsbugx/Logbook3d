import { Environment, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Book } from "./Book";

export const Experience = () => {
  const bookGroup = useRef();

  // Stato del "tieni premuto"
  const isHolding = useRef(false);

  // Stato interno dell'animazione
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!bookGroup.current) {
      return;
    }

    /*
     * Quando il libro NON è premuto,
     * facciamo avanzare normalmente l'animazione.
     *
     * Quando è premuto, il tempo si congela.
     * Di conseguenza posizione e rotazione
     * rimangono esattamente dove si trovavano.
     */
    if (!isHolding.current) {
      time.current += delta;
    }

    const t = time.current;

    /*
     * FLOAT
     *
     * Questi valori riproducono il concetto
     * dell'animazione originale di <Float>.
     *
     * Il movimento rimane leggero e naturale.
     */

    const floatY =
      Math.sin(t * 2) * 0.08 +
      Math.sin(t * 1.3) * 0.025;

    const rotationX =
      -Math.PI / 4 +
      Math.sin(t * 1.1) * 0.025;

    const rotationY =
      Math.sin(t * 0.8) * 0.035;

    const rotationZ =
      Math.cos(t * 1.15) * 0.025;

    bookGroup.current.position.y =
      floatY;

    bookGroup.current.rotation.x =
      rotationX;

    bookGroup.current.rotation.y =
      rotationY;

    bookGroup.current.rotation.z =
      rotationZ;
  });

  /*
   * Quando il pointer viene premuto sul libro,
   * congeliamo SOLO il movimento globale del libro.
   *
   * Non tocchiamo le pagine.
   */

  const handlePointerDown = (event) => {
    event.stopPropagation();

    isHolding.current = true;
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();

    isHolding.current = false;
  };

  const handlePointerCancel = (event) => {
    event.stopPropagation();

    isHolding.current = false;
  };

  /*
   * Se il mouse viene rilasciato fuori dal canvas
   * o il browser interrompe il touch,
   * assicuriamoci comunque che il libro riparta.
   */

  const handlePointerMissed = () => {
    isHolding.current = false;
  };

  return (
    <>
      <group
        ref={bookGroup}
        rotation-x={-Math.PI / 4}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerMissed={handlePointerMissed}
      >
        <Book />
      </group>

      <OrbitControls />

      <Environment preset="studio"></Environment>

      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <mesh
        position-y={-1.5}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />

        <shadowMaterial
          transparent
          opacity={0.2}
        />
      </mesh>
    </>
  );
};