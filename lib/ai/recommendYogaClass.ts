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

export type RecommendationResult = {
  recommended_class: string;
  difficulty: string;
  focus_area: string;
  weekly_plan: string;
};

export function recommendYogaClass(profile: StudentProfile): RecommendationResult {
  const { experience_level, goals, injuries } = profile;

  let result: RecommendationResult = {
    recommended_class: "Hatha Yoga Cơ Bản",
    difficulty: "Mới bắt đầu",
    focus_area: "Toàn thân & Hơi thở",
    weekly_plan: "3 buổi/tuần (Thứ 2, 4, 6)"
  };

  // Logic based on Step 3 specifications
  
  if (experience_level === 'beginner' && goals.includes('flexibility')) {
    result = {
      recommended_class: 'Beginner Flow Yoga',
      difficulty: 'Dễ',
      focus_area: 'Linh hoạt cột sống',
      weekly_plan: 'Tập trung kéo giãn sâu 30 phút mỗi buổi'
    };
  } else if (goals.includes('stress_relief')) {
    result = {
      recommended_class: 'Gentle Relaxation Yoga',
      difficulty: 'Rất dễ',
      focus_area: 'Giải tỏa căng thẳng thần kinh',
      weekly_plan: 'Thiền định & Phục hồi mỗi tối 20 phút'
    };
  } else if (goals.includes('lose_weight')) {
    result = {
      recommended_class: 'Power Flow Yoga',
      difficulty: 'Trung bình - Khó',
      focus_area: 'Đốt cháy calo & Sức bền',
      weekly_plan: 'Luyện tập cường độ cao 3-4 buổi/tuần'
    };
  } else if (goals.includes('rehabilitation') || injuries.length > 0) {
    result = {
      recommended_class: 'Therapeutic Yoga',
      difficulty: 'Tùy chỉnh',
      focus_area: 'Hỗ trợ phục hồi chấn thương',
      weekly_plan: 'Chuyển động nhẹ nhàng có trợ cụ 2 buổi/tuần'
    };
  } else if (goals.includes('strength')) {
    result = {
      recommended_class: 'Ashtanga Yoga',
      difficulty: 'Khó',
      focus_area: 'Sức mạnh cơ bắp & Kỷ luật',
      weekly_plan: 'Chuỗi động tác cố định 5 buổi/tuần'
    };
  } else {
    // Default fallbacks based on experience
    if (experience_level === 'beginner') {
      result = {
        recommended_class: 'Hatha Yoga',
        difficulty: 'Dễ',
        focus_area: 'Cân bằng & Tĩnh tại',
        weekly_plan: 'Khởi đầu nhẹ nhàng 2 buổi/tuần'
      };
    } else if (experience_level === 'intermediate') {
      result = {
        recommended_class: 'Vinyasa Flow',
        difficulty: 'Trung bình',
        focus_area: 'Dòng chảy chuyển động',
        weekly_plan: 'Kết hợp nhịp thở & Cường độ vừa phải'
      };
    } else {
      result = {
        recommended_class: 'Advanced Power Yoga',
        difficulty: 'Rất khó',
        focus_area: 'Kỹ thuật nâng cao',
        weekly_plan: 'Thử thách giới hạn 6 buổi/tuần'
      };
    }
  }

  return result;
}
