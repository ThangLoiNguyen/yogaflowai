export type StudentProfile = {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  injuries: string[];
  schedule: {
    available_days: string[];
    available_time: string;
    preferred_intensity: string;
  };
};

export function recommendClass(profile: StudentProfile): string {
  const { experience_level, goals, injuries } = profile;

  // Simple rule-based AI logic as specified
  
  // IF beginner AND flexibility goal
  if (experience_level === 'beginner' && goals.includes('flexibility')) {
    return 'Beginner Flow Yoga';
  }

  // IF stress_relief goal
  if (goals.includes('stress_relief')) {
    return 'Relaxation Yoga';
  }

  // IF lose_weight goal
  if (goals.includes('lose_weight')) {
    return 'Power Flow Yoga';
  }

  // IF rehabilitation or strength or injuries
  if (goals.includes('rehabilitation') || injuries.length > 0) {
    return 'Therapeutic Yoga';
  }

  if (goals.includes('strength')) {
    return 'Ashtanga Yoga';
  }

  // Default fallback
  if (experience_level === 'beginner') {
    return 'Hatha Yoga';
  } else if (experience_level === 'intermediate') {
    return 'Vinyasa Flow';
  } else {
    return 'Advanced Power Yoga';
  }
}
