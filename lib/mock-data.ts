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
    level: "Cấp độ 1–2",
    duration: "45 phút",
    focus: ["Hông", "Gân kheo", "Hơi thở"],
    intensity: "Gentle",
    score: 96,
    teacher: "Leah Nguyen",
    schedule: "T2, T4, T6 • 7:00 SA",
    enrolled: 18,
    maxSpots: 20,
    rationale:
      "Dựa trên mức căng thẳng cao và kết quả khảo sát của bạn, bài tập nhẹ nhàng này sẽ giúp mở hông và điều hòa hệ thần kinh — ưu tiên hàng đầu tuần này.",
  },
  {
    id: "rec-2",
    name: "Restore & Decompress",
    level: "Tất cả cấp độ",
    duration: "35 phút",
    focus: ["Phục hồi", "Hệ thần kinh", "Giảm căng thẳng"],
    intensity: "Gentle",
    score: 93,
    teacher: "Arjun Sharma",
    schedule: "T3, T5 • 8:00 CH",
    enrolled: 10,
    maxSpots: 15,
    rationale:
      "Dựa trên hoạt động và mức độ căng thẳng gần đây, chúng tôi gợi ý buổi tập phục hồi nhẹ nhàng vào tối nay để tái tạo năng lượng.",
  },
  {
    id: "rec-3",
    name: "Strength for Flow",
    level: "Cấp độ 2",
    duration: "50 phút",
    focus: ["Core", "Vai", "Cân bằng"],
    intensity: "Moderate",
    score: 88,
    teacher: "Maya Kim",
    schedule: "T2, T5 • 6:30 CH",
    enrolled: 14,
    maxSpots: 18,
    rationale:
      "Tốt cho việc xây dựng sức mạnh hỗ trợ transitions vinyasa và các tư thế cân bằng bạn đang hướng đến trong tháng tới.",
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

