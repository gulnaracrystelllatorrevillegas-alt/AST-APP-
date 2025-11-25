export enum AppView {
  WELCOME = 'WELCOME',
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RECOMMENDATION = 'RECOMMENDATION',
  BREATHING = 'BREATHING',
  FINISHED = 'FINISHED',
}

export enum TechniqueId {
  RELAX_4_7_8 = 'RELAX_4_7_8',
  BOX_BREATHING = 'BOX_BREATHING',
  DIAPHRAGMATIC = 'DIAPHRAGMATIC',
  SLOW_PACED = 'SLOW_PACED',
}

export type BreathingPhaseType = 'inhale' | 'hold' | 'exhale' | 'hold_empty';

export interface BreathingPhase {
  type: BreathingPhaseType;
  duration: number; // seconds
  label: string;
}

export interface Technique {
  id: TechniqueId;
  name: string;
  description: string;
  pattern: BreathingPhase[];
}

export interface AIRecommendation {
  techniqueId: TechniqueId;
  reasoning: string;
}

export interface UserInput {
  emotion: string;
  customText: string;
}