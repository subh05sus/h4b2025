// Enhanced Microsoft viseme mapping for realistic lip-sync
// Based on Microsoft Speech API viseme IDs and phonetic mappings
export const CORRESPONDING_VISEME = {
  // Vowels
  A: "viseme_aa", // /ɑ/ as in "father"
  E: "viseme_E", // /ɛ/ as in "bed"
  I: "viseme_I", // /ɪ/ as in "bit"
  O: "viseme_O", // /ɔ/ as in "thought"
  U: "viseme_U", // /ʊ/ as in "book"

  // Bilabial consonants (lips together)
  B: "viseme_PP", // /b/ as in "boy"
  P: "viseme_PP", // /p/ as in "pay"
  M: "viseme_PP", // /m/ as in "man"

  // Labiodental consonants (lip to teeth)
  F: "viseme_FF", // /f/ as in "fun"
  V: "viseme_FF", // /v/ as in "van"

  // Dental/Alveolar consonants
  T: "viseme_TH", // /t/ as in "top"
  D: "viseme_DD", // /d/ as in "dog"
  N: "viseme_nn", // /n/ as in "no"
  L: "viseme_nn", // /l/ as in "let"
  S: "viseme_SS", // /s/ as in "see"
  Z: "viseme_SS", // /z/ as in "zoo"
  R: "viseme_RR", // /r/ as in "red"

  // Velar consonants
  K: "viseme_kk", // /k/ as in "cat"
  G: "viseme_kk", // /g/ as in "go"

  // Palatal consonants
  J: "viseme_CH", // /dʒ/ as in "jump"
  C: "viseme_CH", // Sometimes /tʃ/ as in "church"

  // Glottal
  H: "viseme_I", // /h/ as in "hat"

  // Additional mappings
  W: "viseme_U", // /w/ as in "way"
  Y: "viseme_I", // /j/ as in "yes"
  Q: "viseme_kk", // /kw/ as in "queen"
  X: "viseme_kk", // /ks/ as in "box"
};

// Microsoft Speech API Viseme to morph target mapping
export const VISEME_TO_MORPHTARGET = {
  0: "viseme_sil", // Silence
  1: "viseme_aa", // /ɑ/ (aa)
  2: "viseme_E", // /ɛ/ (ae)
  3: "viseme_aa", // /ʌ/ (ah)
  4: "viseme_O", // /ɔ/ (ao)
  5: "viseme_U", // /aʊ/ (aw)
  6: "viseme_I", // /aɪ/ (ay)
  7: "viseme_PP", // /b/ (b)
  8: "viseme_CH", // /tʃ/ (ch)
  9: "viseme_DD", // /d/ (d)
  10: "viseme_TH", // /ð/ (dh)
  11: "viseme_E", // /ɛ/ (eh)
  12: "viseme_RR", // /ɝ/ (er)
  13: "viseme_I", // /eɪ/ (ey)
  14: "viseme_FF", // /f/ (f)
  15: "viseme_kk", // /g/ (g)
  16: "viseme_I", // /h/ (hh)
  17: "viseme_I", // /ɪ/ (ih)
  18: "viseme_I", // /aɪ/ (iy)
  19: "viseme_CH", // /dʒ/ (jh)
  20: "viseme_kk", // /k/ (k)
  21: "viseme_nn", // /l/ (l)
  22: "viseme_PP", // /m/ (m)
  23: "viseme_nn", // /n/ (n)
  24: "viseme_kk", // /ŋ/ (ng)
  25: "viseme_O", // /oʊ/ (ow)
  26: "viseme_O", // /ɔɪ/ (oy)
  27: "viseme_PP", // /p/ (p)
  28: "viseme_RR", // /r/ (r)
  29: "viseme_SS", // /s/ (s)
  30: "viseme_CH", // /ʃ/ (sh)
  31: "viseme_DD", // /t/ (t)
  32: "viseme_TH", // /θ/ (th)
  33: "viseme_U", // /ʊ/ (uh)
  34: "viseme_U", // /u/ (uw)
  35: "viseme_FF", // /v/ (v)
  36: "viseme_U", // /w/ (w)
  37: "viseme_I", // /j/ (y)
  38: "viseme_SS", // /z/ (z)
  39: "viseme_SS", // /ʒ/ (zh)
};

// List of available visemes for Ready Player Me avatars
export const VISEMES = [
  "viseme_sil", // Silence
  "viseme_PP", // Bilabial sounds (P, B, M)
  "viseme_FF", // Labiodental sounds (F, V)
  "viseme_TH", // Dental sounds (TH, T)
  "viseme_DD", // Alveolar stops (D)
  "viseme_kk", // Velar sounds (K, G)
  "viseme_CH", // Palatal sounds (CH, J, SH)
  "viseme_SS", // Sibilants (S, Z)
  "viseme_nn", // Alveolar nasals and liquids (N, L)
  "viseme_RR", // Rhotic sounds (R)
  "viseme_aa", // Open vowels (A)
  "viseme_E", // Mid-front vowels (E)
  "viseme_I", // High-front vowels (I)
  "viseme_O", // Mid-back vowels (O)
  "viseme_U", // High-back vowels (U)
];

// Phoneme duration mapping for realistic timing (in milliseconds)
export const PHONEME_DURATIONS = {
  // Vowels - generally longer
  viseme_aa: 180,
  viseme_E: 160,
  viseme_I: 140,
  viseme_O: 200,
  viseme_U: 180,

  // Stops - shorter
  viseme_PP: 120,
  viseme_DD: 110,
  viseme_kk: 120,
  viseme_TH: 100,

  // Fricatives - medium
  viseme_FF: 140,
  viseme_SS: 160,
  viseme_CH: 150,

  // Nasals and liquids - medium
  viseme_nn: 130,
  viseme_RR: 140,

  // Silence
  viseme_sil: 50,
};

// Viseme intensity mapping for natural speech
export const VISEME_INTENSITY = {
  viseme_aa: 0.9, // Very open mouth
  viseme_O: 0.8, // Rounded mouth
  viseme_U: 0.7, // Pursed lips
  viseme_E: 0.6, // Medium opening
  viseme_I: 0.5, // Small opening
  viseme_PP: 0.8, // Lips closed/pressed
  viseme_FF: 0.7, // Lip to teeth
  viseme_SS: 0.6, // Teeth together
  viseme_TH: 0.5, // Tongue to teeth
  viseme_DD: 0.6, // Tongue to roof
  viseme_kk: 0.7, // Back of tongue
  viseme_CH: 0.7, // Tongue position
  viseme_nn: 0.6, // Nasal
  viseme_RR: 0.6, // Rhotic
  viseme_sil: 0.0, // Silent
};
