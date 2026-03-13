// Minimal helper type for Supabase tables used by the app.

export type Tables = {
  courses: {
    id: string;
    title: string;
    level: string | null;
    focus: string[] | null;
    teacher_id: string | null;
  };
};

