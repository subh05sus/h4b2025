"use client";
import React, { useState, useEffect, useRef } from "react";
import { useGraph, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useFBX } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import {
  CORRESPONDING_VISEME,
  VISEME_TO_MORPHTARGET,
  PHONEME_DURATIONS,
  VISEME_INTENSITY,
} from "../lib/constants";
import * as THREE from "three";

export function Avatar(props) {
  const { text, speak, setSpeak } = props;
  const { scene } = useGLTF("/models/674d75af3c0313725248ed0d.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // Animation states
  const [animation, setAnimation] = useState("Idle");
  const currentViseme = useRef("viseme_sil");
  const visemeQueue = useRef([]);
  const visemeStartTime = useRef(0);
  const currentVisemeData = useRef({ viseme: "viseme_sil", intensity: 0 });

  // Speech synthesis references
  const utteranceRef = useRef(null);
  const headRef = useRef();
  const teethRef = useRef();
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioDataRef = useRef(null);

  // Load idle animation (you can add this file to public/animations/)
  // const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  // if (idleAnimation.length > 0) {
  //   idleAnimation[0].name = "Idle";
  // }

  // const { actions } = useAnimations([...(idleAnimation || [])], nodes.Hips);

  // Enhanced Text-to-Speech with proper viseme timing
  useEffect(() => {
    if (speak && text.trim()) {
      // Initialize audio context for better audio analysis
      const initAudioContext = async () => {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          audioDataRef.current = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
        }
      };

      initAudioContext();

      // Create enhanced speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure speech settings for better clarity
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Enhanced viseme generation from text
      const generateVisemeSequence = (text) => {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const visemeSequence = [];
        let timeOffset = 0;

        words.forEach((word, wordIndex) => {
          const wordDuration = word.length * 100 + 200; // Base timing per word

          for (let i = 0; i < word.length; i++) {
            const char = word[i].toUpperCase();
            const viseme = CORRESPONDING_VISEME[char] || "viseme_sil";
            const phonemeDuration = getPhonemeDuration(char);

            visemeSequence.push({
              viseme: viseme,
              startTime: timeOffset,
              duration: phonemeDuration,
              intensity: getVisemeIntensity(char, i, word.length),
            });

            timeOffset += phonemeDuration;
          }

          // Add slight pause between words
          if (wordIndex < words.length - 1) {
            visemeSequence.push({
              viseme: "viseme_sil",
              startTime: timeOffset,
              duration: 100,
              intensity: 0,
            });
            timeOffset += 100;
          }
        });

        return visemeSequence;
      };

      // Generate viseme sequence
      visemeQueue.current = generateVisemeSequence(text);
      visemeStartTime.current = Date.now();

      // Handle speech events
      utterance.onstart = () => {
        visemeStartTime.current = Date.now();
      };

      utterance.onend = () => {
        currentVisemeData.current = { viseme: "viseme_sil", intensity: 0 };
        visemeQueue.current = [];
        setSpeak(false);
      };

      utterance.onerror = () => {
        currentVisemeData.current = { viseme: "viseme_sil", intensity: 0 };
        visemeQueue.current = [];
        setSpeak(false);
      };

      // Start speech
      speechSynthesis.speak(utterance);
    }

    // Cleanup function
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
        currentVisemeData.current = { viseme: "viseme_sil", intensity: 0 };
        visemeQueue.current = [];
      }
    };
  }, [speak, text, setSpeak]);

  // Helper functions for realistic viseme timing
  const getPhonemeDuration = (phoneme) => {
    const viseme = CORRESPONDING_VISEME[phoneme] || "viseme_sil";
    return PHONEME_DURATIONS[viseme] || 120;
  };

  const getVisemeIntensity = (phoneme, position, wordLength) => {
    const viseme = CORRESPONDING_VISEME[phoneme] || "viseme_sil";
    let baseIntensity = VISEME_INTENSITY[viseme] || 0.5;

    // Add positional and contextual adjustments
    if (position === 0) {
      baseIntensity *= 1.1; // Slightly emphasize word beginnings
    } else if (position === wordLength - 1) {
      baseIntensity *= 0.9; // Slightly reduce word endings
    }

    // Reduce intensity for middle consonants in long words
    if (wordLength > 5 && position > 1 && position < wordLength - 2) {
      baseIntensity *= 0.8;
    }

    // Add slight randomization for natural variation
    const variation = (Math.random() - 0.5) * 0.1;
    return Math.max(0.1, Math.min(1.0, baseIntensity + variation));
  };

  // Enhanced animation frame update for realistic lip-sync
  useFrame(() => {
    // Update current viseme based on timing
    if (visemeQueue.current.length > 0) {
      const currentTime = Date.now() - visemeStartTime.current;
      const activeViseme = visemeQueue.current.find(
        (v) =>
          currentTime >= v.startTime && currentTime < v.startTime + v.duration
      );

      if (activeViseme) {
        currentVisemeData.current = activeViseme;
      } else if (
        currentTime >
        visemeQueue.current[visemeQueue.current.length - 1].startTime +
          visemeQueue.current[visemeQueue.current.length - 1].duration
      ) {
        currentVisemeData.current = { viseme: "viseme_sil", intensity: 0 };
      }
    }

    if (headRef.current && teethRef.current) {
      const headMorphTargets = headRef.current.morphTargetDictionary;
      const teethMorphTargets = teethRef.current.morphTargetDictionary;

      if (headMorphTargets && teethMorphTargets) {
        // Enhanced viseme blending with proper falloff
        Object.keys(headMorphTargets).forEach((key) => {
          if (key.startsWith("viseme_")) {
            const index = headMorphTargets[key];
            if (headRef.current.morphTargetInfluences[index] !== undefined) {
              const isCurrentViseme = key === currentVisemeData.current.viseme;
              const targetValue = isCurrentViseme
                ? currentVisemeData.current.intensity
                : 0;
              const lerpSpeed = isCurrentViseme ? 0.3 : 0.15; // Faster attack, slower decay

              headRef.current.morphTargetInfluences[index] =
                THREE.MathUtils.lerp(
                  headRef.current.morphTargetInfluences[index],
                  targetValue,
                  lerpSpeed
                );
            }
          }
        });

        Object.keys(teethMorphTargets).forEach((key) => {
          if (key.startsWith("viseme_")) {
            const index = teethMorphTargets[key];
            if (teethRef.current.morphTargetInfluences[index] !== undefined) {
              const isCurrentViseme = key === currentVisemeData.current.viseme;
              const targetValue = isCurrentViseme
                ? currentVisemeData.current.intensity * 0.8
                : 0; // Teeth less pronounced
              const lerpSpeed = isCurrentViseme ? 0.3 : 0.15;

              teethRef.current.morphTargetInfluences[index] =
                THREE.MathUtils.lerp(
                  teethRef.current.morphTargetInfluences[index],
                  targetValue,
                  lerpSpeed
                );
            }
          }
        });

        // Add subtle breathing animation when not speaking
        if (currentVisemeData.current.viseme === "viseme_sil" && !speak) {
          const breathingIntensity = Math.sin(Date.now() * 0.001) * 0.02 + 0.02;
          if (headMorphTargets["viseme_aa"]) {
            const breathIndex = headMorphTargets["viseme_aa"];
            if (
              headRef.current.morphTargetInfluences[breathIndex] !== undefined
            ) {
              headRef.current.morphTargetInfluences[breathIndex] =
                THREE.MathUtils.lerp(
                  headRef.current.morphTargetInfluences[breathIndex],
                  breathingIntensity,
                  0.05
                );
            }
          }
        }
      }
    }
  });

  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        ref={headRef}
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        ref={teethRef}
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/674d75af3c0313725248ed0d.glb");
