
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CLASS_IDS: string[] = []; // Store class IDs for registrations

const TEACHERS = [
  { email: 'teacher1@yogai.com', name: 'Leah Nguyen', bio: 'Hơn 10 năm kinh nghiệm dạy Hatha và Vinyasa.', experience: 10, specialties: ['Hatha', 'Vinyasa'] },
  { email: 'teacher2@yogai.com', name: 'Arjun Sharma', bio: 'Chuyên gia phục hồi và thiền định đến từ Ấn Độ.', experience: 15, specialties: ['Restorative', 'Meditation'] },
  { email: 'teacher3@yogai.com', name: 'Maya Kim', bio: 'Tập trung vào sức mạnh core và cân bằng.', experience: 8, specialties: ['Power Yoga', 'Core'] },
  { email: 'teacher4@yogai.com', name: 'Nam Nguyen', bio: 'Giảng viên cấp cao về Ashtanga Yoga.', experience: 12, specialties: ['Ashtanga'] },
  { email: 'teacher5@yogai.com', name: 'Elena Rossi', bio: 'Yoga bay và nhào lộn nghệ thuật.', experience: 7, specialties: ['Aerial Yoga'] },
  { email: 'teacher6@yogai.com', name: 'David Smith', bio: 'Kết hợp Yoga và trị liệu vật lý.', experience: 20, specialties: ['Therapeutic'] },
  { email: 'teacher7@yogai.com', name: 'Sofia Garcia', bio: 'Dạy Yoga cho bà bầu và trẻ em.', experience: 6, specialties: ['Prenatal', 'Kids'] },
  { email: 'teacher8@yogai.com', name: 'Yuki Sato', bio: 'Yin Yoga và giải tỏa căng thẳng.', experience: 9, specialties: ['Yin'] },
  { email: 'teacher9@yogai.com', name: 'Marcus Brown', bio: 'Yoga cường độ cao và Calisthenics.', experience: 11, specialties: ['Functional'] },
  { email: 'teacher10@yogai.com', name: 'Anh Tran', bio: 'Kỹ thuật thở và Yoga cổ điển.', experience: 14, specialties: ['Pranayama'] },
];

const STUDENTS = Array.from({ length: 10 }).map((_, i) => ({
  email: `student${i + 1}@yogai.com`,
  name: `Student Name ${i + 1}`,
  age: 20 + Math.floor(Math.random() * 30),
  gender: Math.random() > 0.5 ? 'male' : 'female',
  height: 150 + Math.floor(Math.random() * 40),
  weight: 45 + Math.floor(Math.random() * 50),
  experience_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
  goals: [['flexibility'], ['stress_relief', 'strength'], ['weight_loss'], ['rehabilitation']][Math.floor(Math.random() * 4)],
  injuries: [['none'], ['back'], ['knee']][Math.floor(Math.random() * 3)],
}));

const CLASS_TYPES = ['Beginner Flow', 'Power Yoga', 'Relaxation Yoga', 'Stretch Yoga', 'Hatha Basics', 'Vinyasa Flow'];

async function seed() {
  console.log('--- Bắt đầu Seed dữ liệu YogAI ---');

  const teacherIds: string[] = [];

  // 1. Tạo Giáo viên
  for (const t of TEACHERS) {
    console.log(`Đang tạo giáo viên: ${t.email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: t.email,
      password: 'teacher123',
      options: { data: { name: t.name, role: 'teacher' } },
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error(`Lỗi tạo auth cho ${t.email}:`, authError.message);
      continue;
    }

    // Lấy ID từ auth hoặc từ table users nếu đã tồn tại
    let userId = authData?.user?.id;
    if (!userId) {
      const { data: existingUser } = await supabase.from('users').select('id').eq('email', t.email).single();
      userId = existingUser?.id;
    }

    if (userId) {
      teacherIds.push(userId);
      // Upsert vào public.users (Phòng trường hợp trigger chưa chạy or cần update)
      await supabase.from('users').upsert({
        id: userId,
        email: t.email,
        name: t.name,
        role: 'teacher'
      }, { onConflict: 'id' });

      // Insert vào teacher_profiles
      await supabase.from('teacher_profiles').upsert({
        user_id: userId,
        bio: t.bio,
        years_experience: t.experience,
        specialties: t.specialties,
        certifications: ['RYT-200']
      }, { onConflict: 'user_id' });

      // Tạo một số lớp học cho giáo viên này
      const numClasses = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numClasses; i++) {
        const className = CLASS_TYPES[Math.floor(Math.random() * CLASS_TYPES.length)];
        const { data: clsData } = await supabase.from('classes').insert({
          name: `${className} with ${t.name.split(' ')[0]}`,
          teacher_id: userId,
          level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          duration: '45-60 minutes',
          intensity: ['Gentle', 'Moderate', 'Dynamic'][Math.floor(Math.random() * 3)],
          focus: t.specialties,
          schedule: 'Mon, Wed, Fri • 7:00 AM',
          max_capacity: 20,
          enrolled: Math.floor(Math.random() * 15)
        }).select().single();
        
        if (clsData) CLASS_IDS.push(clsData.id);
      }
    }
  }

  // 2. Tạo Học viên & Sessions
  for (const s of STUDENTS) {
    console.log(`Đang tạo học viên: ${s.email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: s.email,
      password: 'student123',
      options: { data: { name: s.name, role: 'student' } },
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error(`Lỗi tạo auth cho ${s.email}:`, authError.message);
      continue;
    }

    let userId = authData?.user?.id;
    if (!userId) {
      const { data: existingUser } = await supabase.from('users').select('id').eq('email', s.email).single();
      userId = existingUser?.id;
    }

    if (userId) {
      // Upsert public.users
      await supabase.from('users').upsert({
        id: userId,
        email: s.email,
        name: s.name,
        role: 'student'
      }, { onConflict: 'id' });

      // Insert vào student_profiles
      const { data: profile, error: profError } = await supabase.from('student_profiles').upsert({
        user_id: userId,
        age: s.age,
        gender: s.gender,
        height: s.height,
        weight: s.weight,
        experience_level: s.experience_level,
        goals: s.goals,
        injuries: s.injuries,
        schedule: { available_days: ['T2', 'T4', 'T6'], available_time: '7:00', preferred_intensity: 'Moderate' }
      }, { onConflict: 'user_id' }).select().single();

      if (profError) {
        console.error(`Lỗi tạo profile cho ${s.email}:`, profError.message);
        continue;
      }

      // Tạo Training Sessions
      const numSessions = 5 + Math.floor(Math.random() * 11);
      const studentProfileId = profile.id;

      for (let j = 0; j < numSessions; j++) {
        const randomTeacherId = teacherIds[Math.floor(Math.random() * teacherIds.length)];
        const date = new Date();
        date.setDate(date.getDate() - (numSessions - j) * 2);

        await supabase.from('training_sessions').insert({
          student_id: studentProfileId,
          teacher_id: randomTeacherId,
          date: date.toISOString(),
          class_type: CLASS_TYPES[Math.floor(Math.random() * CLASS_TYPES.length)],
          flexibility_score: 40 + Math.floor(Math.random() * 60),
          strength_score: 30 + Math.floor(Math.random() * 70),
          notes: `Buổi học cải thiện ${s.goals[0]}. Học viên biểu hiện tốt.`
        });
      }

      // Đăng ký một vài lớp học cho học viên này
      const numReg = 1 + Math.floor(Math.random() * 3);
      const shuffledClasses = [...CLASS_IDS].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numReg; i++) {
        if (shuffledClasses[i]) {
          await supabase.from('class_registrations').upsert({
            student_id: studentProfileId,
            class_id: shuffledClasses[i]
          }, { onConflict: 'class_id, student_id' });
        }
      }
    }
  }

  console.log('--- Seed dữ liệu hoàn tất! ---');
}

seed().catch(console.error);
