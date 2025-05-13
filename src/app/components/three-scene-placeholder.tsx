"use client";

import React, { useRef, useEffect, useState } from 'react';

const ThreeScenePlaceholder: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (mountRef.current) {
        setDimensions({
          width: mountRef.current.clientWidth,
          height: mountRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Simulate 3D object loading - Placeholder logic
    // In a real scenario, you'd initialize your THREE.js scene here
    let animationFrameId: number;
    const animate = () => {
      // Simple animation placeholder
      animationFrameId = requestAnimationFrame(animate);
    };

    if (typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0) {
      // Dynamically import THREE only on client side after mount and if dimensions are set
      import('three').then(THREE => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(dimensions.width, dimensions.height);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        if (mountRef.current && mountRef.current.children.length === 0) {
            mountRef.current.appendChild(renderer.domElement);
        }


        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x008080 }); // Teal color
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(2, 3, 4);
        scene.add(pointLight);

        camera.position.z = 3;

        const animateScene = () => {
          animationFrameId = requestAnimationFrame(animateScene);
          cube.rotation.x += 0.005;
          cube.rotation.y += 0.005;
          renderer.render(scene, camera);
        };
        animateScene();
        
        // Handle resize
        const handleResize = () => {
            if (mountRef.current) {
                const newWidth = mountRef.current.clientWidth;
                const newHeight = mountRef.current.clientHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
          cancelAnimationFrame(animationFrameId);
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('resize', updateDimensions);
        };
      }).catch(error => console.error("Failed to load THREE.js", error));
    } else {
        return () => {
            window.removeEventListener('resize', updateDimensions);
        }
    }


  }, [dimensions.width, dimensions.height]);


  return (
    <div ref={mountRef} className="w-full h-64 md:h-96 outline-dashed outline-muted rounded-lg flex items-center justify-center text-muted-foreground">
      {dimensions.width === 0 && <p>Loading 3D Scene...</p>}
    </div>
  );
};

export default ThreeScenePlaceholder;
