'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Menu, X, Code, Users, Trophy, Calendar, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const BroCodeWebsite = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (! isMounted || !canvasRef.current) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef. current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: '#00ffff',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Rotating Code Cube
    const cubeGeometry = new THREE. BoxGeometry(1.5, 1.5, 1. 5);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const cubeMaterial = new THREE.LineBasicMaterial({
      color: '#ff00ff',
      linewidth: 2,
    });
    const cube = new THREE.LineSegments(edges, cubeMaterial);
    scene.add(cube);

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e. clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      cube.rotation.x += 0. 005;
      cube.rotation.y += 0.005;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0. 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window. addEventListener('resize', handleResize);

    // Scroll animations
    const handleScroll = () => {
      const sections = ['home', 'about', 'highlights', 'tracks', 'register', 'team'];
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      });

      const reveals = document.querySelectorAll('. reveal');
      reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element. classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      renderer.dispose();
    };
  }, [isMounted]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }

        . gradient-text {
          background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glow {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .glow:hover {
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5);
          transform: translateY(-2px);
        }

        . glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .neon-border {
          border: 2px solid transparent;
          background: linear-gradient(#000, #000) padding-box,
                      linear-gradient(135deg, #00ffff, #ff00ff) border-box;
        }

        .reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease;
        }

        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .card-3d:hover {
          transform: rotateY(5deg) rotateX(5deg) scale(1.05);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5); }
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        . ripple {
          position: relative;
          overflow: hidden;
        }

        .ripple::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .ripple:active::after {
          width: 300px;
          height: 300px;
        }

        @media (max-width: 768px) {
          .card-3d:hover {
            transform: scale(1.02);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold gradient-text">BroCode</div>

            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'highlights', 'tracks', 'register', 'team'].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize transition-all ${
                      activeSection === section
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-300 hover:text-cyan-400'
                    }`}
                  >
                    {section}
                  </button>
                )
              )}
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden glass">
            <div className="px-4 py-4 space-y-3">
              {['home', 'about', 'highlights', 'tracks', 'register', 'team'].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block w-full text-left capitalize py-2 hover:text-cyan-400 transition-colors"
                  >
                    {section}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div className="relative z-10 text-center px-4 reveal active">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">BroCode</span>
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl mb-4 text-gray-300">
            The Ultimate Coding Challenge
          </p>
          <p className="text-lg md:text-xl text-cyan-400 mb-8 float">
            Code.  Create. Dominate. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('register')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg glow ripple"
            >
              Register Now
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-8 py-4 glass neon-border rounded-full font-semibold text-lg ripple hover:bg-white/10"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-b from-black via-purple-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text reveal">
            About BroCode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code size={40} />,
                title: '48 Hours',
                desc: 'Non-stop coding marathon',
              },
              {
                icon: <Users size={40} />,
                title: '500+ Coders',
                desc: 'From across the nation',
              },
              {
                icon: <Trophy size={40} />,
                title: '$50K Prizes',
                desc: 'Win amazing rewards',
              },
            ]. map((item, i) => (
              <div
                key={i}
                className="glass neon-border rounded-2xl p-8 text-center card-3d reveal"
                style={{ transitionDelay: `${i * 0.2}s` }}
              >
                <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 mb-4 pulse-glow">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-400">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section id="highlights" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text reveal">
            Event Highlights
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6 reveal">
              {[
                { time: 'Day 1 - 9:00 AM', event: 'Opening Ceremony' },
                { time: 'Day 1 - 10:00 AM', event: 'Coding Begins' },
                { time: 'Day 1 - 8:00 PM', event: 'Tech Talks & Workshops' },
                { time: 'Day 2 - 9:00 AM', event: 'Final Sprint' },
                { time: 'Day 2 - 6:00 PM', event: 'Project Submissions' },
                { time: 'Day 2 - 8:00 PM', event: 'Awards Ceremony' },
              ]. map((item, i) => (
                <div
                  key={i}
                  className="glass neon-border rounded-xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <p className="text-cyan-400 font-semibold">{item.time}</p>
                    <p className="text-lg text-white">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass neon-border rounded-2xl p-8 reveal">
              <h3 className="text-3xl font-bold mb-6 gradient-text">Why Join?</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">▸</span>
                  Network with top developers and industry leaders
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">▸</span>
                  Build innovative projects with cutting-edge tech
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">▸</span>
                  Win prizes, swag, and exclusive opportunities
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">▸</span>
                  Get mentorship from tech veterans
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">▸</span>
                  Access to premium tools and resources
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="py-20 px-4 bg-gradient-to-b from-black via-cyan-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text reveal">
            Competition Tracks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI/ML', color: 'from-blue-500 to-cyan-500' },
              { title: 'Web3', color: 'from-purple-500 to-pink-500' },
              { title: 'FinTech', color: 'from-green-500 to-teal-500' },
              { title: 'IoT', color: 'from-orange-500 to-red-500' },
            ].map((track, i) => (
              <div
                key={i}
                className="glass neon-border rounded-xl p-8 text-center card-3d reveal cursor-pointer"
                style={{ transitionDelay: `${i * 0. 1}s` }}
              >
                <div
                  className={`h-2 w-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${track.color}`}
                ></div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {track.title}
                </h3>
                <p className="text-gray-400">Build the future</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text reveal">
            Register Now
          </h2>

          <form className="glass neon-border rounded-2xl p-8 space-y-6 reveal" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <select className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-all">
                <option value="">Select Track</option>
                <option>AI/ML</option>
                <option>Web3</option>
                <option>FinTech</option>
                <option>IoT</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-lg glow ripple"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 bg-gradient-to-b from-black via-purple-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text reveal">
            Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Alex Chen', 'Sarah Kim', 'Marcus Rodriguez', 'Emily Zhang']. map(
              (name, i) => (
                <div
                  key={i}
                  className="glass neon-border rounded-xl p-6 text-center card-3d reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 pulse-glow"></div>
                  <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                  <p className="text-cyan-400 text-sm mb-4">Organizer</p>
                  <div className="flex justify-center space-x-3">
                    <Github
                      size={20}
                      className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors"
                    />
                    <Twitter
                      size={20}
                      className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors"
                    />
                    <Linkedin
                      size={20}
                      className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">BroCode</h3>
              <p className="text-gray-400">
                The ultimate coding challenge for developers who dare to dominate.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">
                Quick Links
              </h4>
              <div className="space-y-2">
                {['About', 'Tracks', 'Register', 'Contact'].map((link) => (
                  <button
                    key={link}
                    className="block text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <Mail size={16} className="mr-2" /> hello@brocode.dev
                </p>
                <div className="flex space-x-4 mt-4">
                  <Github
                    size={24}
                    className="hover:text-cyan-400 cursor-pointer transition-colors"
                  />
                  <Twitter
                    size={24}
                    className="hover:text-cyan-400 cursor-pointer transition-colors"
                  />
                  <Linkedin
                    size={24}
                    className="hover:text-cyan-400 cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 pt-8 border-t border-gray-800">
            © 2025 BroCode. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BroCodeWebsite;
