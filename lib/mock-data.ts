import type { Recommendation } from "@/components/recommendation-card";
import type { StudentProgressData } from "@/components/student-progress";
import type { TeacherAnalyticsData } from "@/components/teacher-analytics";

export const mockStudentProgress: StudentProgressData = {
  flexibility: 72,
  balance: 65,
  stress: 38,
  attendance: 84,
};

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    name: "Grounded Morning Flow",
    level: "Level 1–2",
    duration: "45 min",
    focus: ["Hips", "Hamstrings", "Breath"],
    intensity: "Gentle",
    rationale:
      "Recommended to gradually open hips and hamstrings while keeping nervous system regulation as the priority.",
  },
  {
    id: "rec-2",
    name: "Restore & Decompress",
    level: "All levels",
    duration: "35 min",
    focus: ["Restorative", "Nervous system", "Stress relief"],
    intensity: "Gentle",
    rationale:
      "Based on your reported stress and recent activity, we suggest a supportive restorative practice tonight.",
  },
  {
    id: "rec-3",
    name: "Strength for Flow",
    level: "Level 2",
    duration: "50 min",
    focus: ["Core", "Shoulders", "Balance"],
    intensity: "Moderate",
    rationale:
      "Great for building strength to support vinyasa transitions and standing balance work over the next month.",
  },
];

export const mockUpcomingClasses = [
  {
    id: "up-1",
    name: "Evening Unwind Flow",
    when: "Today • 6:30 PM",
    teacher: "Leah",
    type: "Recommended" as const,
  },
  {
    id: "up-2",
    name: "Sunday Yin & Restore",
    when: "Sun • 7:00 PM",
    teacher: "Arjun",
    type: "Booked" as const,
  },
];

export const mockTeacherAnalytics: TeacherAnalyticsData = {
  activeStudents: 124,
  avgAttendance: 78,
  progressionRate: 32,
  retention: 88,
};

export const mockStudents = [
  {
    id: "s-1",
    name: "Maya Patel",
    level: "Level 1–2",
    focus: "Stress relief",
    attendance: 86,
    recentClass: "Restore & Decompress",
  },
  {
    id: "s-2",
    name: "Alex Chen",
    level: "Level 2",
    focus: "Strength & mobility",
    attendance: 91,
    recentClass: "Strength for Flow",
  },
  {
    id: "s-3",
    name: "Sara Lee",
    level: "Beginner",
    focus: "Recovery",
    attendance: 74,
    recentClass: "Gentle Foundation Flow",
  },
  {
    id: "s-4",
    name: "Jordan Rivera",
    level: "Level 2–3",
    focus: "Inversions",
    attendance: 68,
    recentClass: "Playful Arm Balances",
  },
];

export const mockClassesPerformance = [
  {
    id: "c-1",
    name: "Grounded Morning Flow",
    fill: 82,
    occurrences: 4,
  },
  {
    id: "c-2",
    name: "Restore & Decompress",
    fill: 76,
    occurrences: 3,
  },
  {
    id: "c-3",
    name: "Strength for Flow",
    fill: 88,
    occurrences: 5,
  },
];

