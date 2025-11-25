import { Technique, TechniqueId } from './types';

export const TECHNIQUES: Record<TechniqueId, Technique> = {
  [TechniqueId.RELAX_4_7_8]: {
    id: TechniqueId.RELAX_4_7_8,
    name: "Técnica 4-7-8",
    description: "Ideal para la ansiedad severa y ataques de pánico. Actúa como un tranquilizante natural para el sistema nervioso.",
    pattern: [
      { type: 'inhale', duration: 4, label: 'Inhala por la nariz' },
      { type: 'hold', duration: 7, label: 'Mantén el aire' },
      { type: 'exhale', duration: 8, label: 'Exhala por la boca' },
    ]
  },
  [TechniqueId.BOX_BREATHING]: {
    id: TechniqueId.BOX_BREATHING,
    name: "Respiración en Caja",
    description: "Perfecta para recuperar la concentración y calmar los nervios. Utilizada por profesionales en situaciones de alto estrés.",
    pattern: [
      { type: 'inhale', duration: 4, label: 'Inhala' },
      { type: 'hold', duration: 4, label: 'Mantén' },
      { type: 'exhale', duration: 4, label: 'Exhala' },
      { type: 'hold_empty', duration: 4, label: 'Espera vacío' },
    ]
  },
  [TechniqueId.DIAPHRAGMATIC]: {
    id: TechniqueId.DIAPHRAGMATIC,
    name: "Respiración Diafragmática",
    description: "Ayuda a reducir el cortisol y bajar el ritmo cardíaco. Enfócate en inflar tu abdomen, no tu pecho.",
    pattern: [
      { type: 'inhale', duration: 5, label: 'Inhala profundo (infla abdomen)' },
      { type: 'exhale', duration: 5, label: 'Exhala lento' },
    ]
  },
  [TechniqueId.SLOW_PACED]: {
    id: TechniqueId.SLOW_PACED,
    name: "Respiración Lenta Constante",
    description: "Equilibra tu sistema nervioso cuando te sientes alterado pero no en pánico.",
    pattern: [
      { type: 'inhale', duration: 6, label: 'Inhala suavemente' },
      { type: 'exhale', duration: 6, label: 'Exhala suavemente' },
    ]
  },
};

export const EMOTION_OPTIONS = [
  "Estoy nerviosa",
  "Estoy alterada",
  "Tengo un ataque de pánico",
  "Tengo miedo",
  "Necesito relajarme"
];