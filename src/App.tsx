import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Music, PauseCircle, PlayCircle, Gift } from 'lucide-react';
import * as THREE from 'three';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [audio] = useState(new Audio('/audio/background-music.mp3'));
  const mountRef = useRef(null);

  const birthdayPhotos = [
    '/image/photo1.jpeg',
    '/image/photo2.jpeg',
    '/image/photo3.jpeg'
  ];

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
    };
  }, [audio]);

  const toggleMusic = async () => {
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleReveal = async () => {
    if (!isRevealed) {
      setIsRevealed(true);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  // Three.js Setup
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    scene.background = new THREE.Color('#1f2937');

    const particles = 10000;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.9) {
        colors[i * 3] = 0.82;
        colors[i * 3 + 1] = 0.83;
        colors[i * 3 + 2] = 0.86;
      } else {
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.71;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 500;

    const animate = () => {
      requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="w-full max-w-lg relative z-10">
        <button
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 text-pink-400 hover:text-pink-300 transition-colors"
          aria-label="Toggle music"
        >
          {isPlaying ? (
            <PauseCircle size={32} />
          ) : (
            <div className="flex items-center gap-2">
              <Music size={32} />
              <span className="text-sm hidden sm:inline text-gray-200">Music</span>
            </div>
          )}
        </button>

        {!isRevealed ? (
          <button
            onClick={handleReveal}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-400 rounded-3xl shadow-xl p-8 text-white hover:from-pink-500 hover:to-pink-300 transition-all transform hover:scale-105 cursor-pointer relative overflow-hidden border-2 border-gray-200"
          >
            <div className="text-center relative z-10">
              <Gift size={64} className="mx-auto mb-4 animate-bounce text-white" />
              <p className="text-2xl sm:text-3xl font-bold drop-shadow-lg">Click to Open</p>
              <p className="text-sm sm:text-base mt-2 opacity-75">A romantic surprise awaits you...</p>
            </div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-10" />
          </button>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.5s_ease-in] relative border-2 border-gray-300">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-5" />

            <div className="h-32 sm:h-48 bg-gradient-to-r from-gray-800 to-gray-600 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full flex justify-around items-start">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-10 sm:w-8 sm:h-12 rounded-t-full bg-${['pink-400', 'gray-200', 'pink-400', 'gray-200', 'pink-400'][i]} animate-[float_2s_ease-in-out_infinite]`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>

            <div className="relative -mt-16 sm:-mt-24 px-4 sm:px-6 flex justify-center gap-2 sm:gap-4">
              {birthdayPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg transform transition-all hover:scale-110 bg-white"
                  style={{ animation: `slideIn 0.5s ease-in ${index * 0.2}s both` }}
                >
                  <img
                    src={photo}
                    alt={`Birthday moment ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="p-6 sm:p-8 text-center relative z-10 bg-white">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-600 mb-4 animate-[pulse_2s_infinite] drop-shadow-md">
                Happy Birthday, My Dearest Keysa! 🎉
              </h1>

              <div className="space-y-4 text-gray-800 text-sm sm:text-base">
                <p className="animate-[fadeIn_0.5s_ease-in_0.3s_both]">
                  To the one who lights up my universe, may this day wrap you in the warmth of my love and the sweetness of every moment we share.
                </p>

                <div className="flex justify-center gap-2 sm:gap-3 animate-[bounce_1s_infinite]">
                  <Heart className="text-pink-500 w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                  <Gift className="text-gray-800 w-5 h-5 sm:w-6 sm:h-6" />
                  <Heart className="text-pink-500 w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                </div>

                <p className="italic text-pink-500 text-xs sm:text-sm">
                  "My heart beats for you, today and always. <br className="sm:hidden" />
                  May our journey ahead be filled with endless love, boundless joy, and dreams that touch the stars."
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 text-center border-t-2 border-pink-400">
              <p className="text-gray-800 font-semibold text-sm sm:text-base">
                Forever yours with all my love ❤️🎂🎁
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;