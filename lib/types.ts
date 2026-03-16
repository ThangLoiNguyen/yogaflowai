
export type Tables = {
  users: {
    id: string;
    name: string | null;
    email: string;
    role: 'student' | 'teacher';
    avatar_url: string | null;
  };
  student_profiles: {
    id: string;
    user_id: string;
    age: number | null;
    gender: string | null;
    height: number | null;
    weight: number | null;
    experience_level: string | null;
    goals: string[] | null;
    injuries: string[] | null;
    schedule: any;
  };
  teacher_profiles: {
    id: string;
    user_id: string;
    bio: string | null;
    specialties: string[] | null;
    certifications: string[] | null;
    years_experience: number;
  };
  classes: {
    id: string;
    name: string;
    teacher_id: string | null;
    level: string | null;
    duration: string | null;
    intensity: string | null;
    focus: string[] | null;
    rating: number;
    enrolled: number;
    max_capacity: number;
    schedule: string | null;
  };
  training_sessions: {
    id: string;
    student_id: string;
    teacher_id: string | null;
    date: string;
    class_type: string | null;
    flexibility_score: number | null;
    strength_score: number | null;
    notes: string | null;
  };
};
