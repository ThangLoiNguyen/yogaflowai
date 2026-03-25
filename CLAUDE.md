# CLAUDE.md — YogAI Project Reference

> Tài liệu tham chiếu nội bộ dành cho AI agents làm việc trên codebase này.  
> Chỉ ghi những gì **thực sự có** trong project. Mục không rõ ghi `# TODO: cần xác nhận`.

---

## 1. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | `reactCompiler: true` trong next.config.ts |
| Language | **TypeScript 5** | Strict mode |
| Styling | **Tailwind CSS v4** | Config via `@theme` trong globals.css — không có tailwind.config.ts |
| Component Library | **shadcn/ui** (tùy chỉnh) | Nằm trong `components/ui/` |
| Icons | **lucide-react** | |
| Auth | **Supabase Auth** (`@supabase/ssr`) | Cookie-based, SSR-safe |
| Database | **Supabase** (PostgreSQL) | Client-side: `lib/supabase.ts`, Server-side: `utils/supabase/server.ts` |
| AI | **OpenAI** (`openai` ^4.73) | Dùng trong `lib/ai/`, `app/api/ai/` |
| Video/Live | **LiveKit** (`livekit-client`, `livekit-server-sdk`) | WebRTC live streaming |
| Charts | **Recharts** | Dùng trong analytics |
| Toast | **Sonner** | Provider trong `app/layout.tsx` |
| Payments | **Stripe** | `@stripe/react-stripe-js`, webhook handler ở `app/api/webhook/` |
| Email | **Resend** | |
| Fonts | DM Serif Display, DM Sans, JetBrains Mono | Google Fonts, inject qua `app/layout.tsx` |
| Deploy | # TODO: cần xác nhận | Chưa tìm thấy config Vercel/Dockerfile |

---

## 2. Cấu trúc thư mục

```
yogaflow-ai/
├── app/                        # Next.js App Router — toàn bộ pages và API
│   ├── layout.tsx              # Root layout: fonts, Toaster, metadata
│   ├── globals.css             # Design tokens (@theme), base styles, animations
│   ├── page.tsx                # Trang Home (public, chưa đăng nhập)
│   ├── (session)/              # Route group — live session cho teacher
│   │   └── teacher/session/    # Màn hình live stream của GV
│   ├── actions/                # Server Actions
│   │   └── auth.ts             # login(), signup(), logout()
│   ├── api/                    # Route handlers (API endpoints)
│   │   ├── ai/                 # AI suggestion endpoints
│   │   ├── livekit/            # LiveKit token generation
│   │   ├── classes/            # CRUD classes
│   │   ├── sessions/           # Session management
│   │   ├── checkout/           # Stripe checkout
│   │   ├── webhook/            # Stripe webhooks
│   │   ├── webhooks/           # (xem thêm) Supabase webhooks
│   │   ├── profile/            # Profile update
│   │   ├── student/            # Student-specific endpoints
│   │   ├── teacher/            # Teacher-specific endpoints
│   │   ├── teacher-analytics/  # Analytics for teachers
│   │   ├── enroll-course/      # Course enrollment
│   │   ├── recommend-class/    # AI class recommendation
│   │   └── update-progress/    # Progress tracking
│   ├── auth/callback/          # Supabase OAuth callback
│   ├── login/                  # Trang đăng nhập
│   ├── register/               # Trang đăng ký + /register/quiz (onboarding quiz)
│   ├── reset-password/         # Đặt lại mật khẩu
│   ├── student/                # Dashboard khu vực học viên (protected)
│   │   ├── layout.tsx          # Sidebar + BottomNav
│   │   ├── page.tsx            # Student dashboard
│   │   ├── classes/            # Xem và đặt lớp học
│   │   ├── course/             # Chi tiết khóa học
│   │   ├── explore/            # Khám phá lớp học
│   │   ├── messages/           # Chat với giáo viên
│   │   ├── profile/            # Hồ sơ học viên
│   │   ├── progress/           # Theo dõi tiến độ
│   │   ├── quiz/[sessionId]/   # Post-session feedback quiz
│   │   └── session/[id]/       # Tham gia live session
│   ├── teacher/                # Dashboard khu vực giáo viên (protected)
│   │   ├── layout.tsx          # Sidebar + BottomNav
│   │   ├── page.tsx            # Teacher dashboard
│   │   ├── ai-insights/        # AI insights về học viên
│   │   ├── classes/            # Quản lý lớp học (new, [id]/edit)
│   │   ├── earnings/           # Thu nhập
│   │   ├── messages/           # Chat với học viên
│   │   ├── profile/            # Hồ sơ giáo viên
│   │   ├── schedule/           # Lịch dạy
│   │   └── students/           # Danh sách học viên
│   ├── teachers/               # Trang danh sách giáo viên (public)
│   ├── classes/                # Trang danh sách lớp (public)
│   └── recommendation/         # AI gợi ý khóa học
├── components/                 # Shared React components
│   ├── ui/                     # shadcn/ui primitives (button, input, dialog...)
│   ├── dashboard-nav.tsx       # Top nav cho dashboard (có logo + links)
│   ├── sidebar.tsx             # Left sidebar cho cả student và teacher
│   ├── bottom-nav.tsx          # Mobile bottom navigation
│   ├── ai-assistant.tsx        # AI chat widget
│   ├── classes-list.tsx        # Danh sách lớp học
│   ├── onboarding-form.tsx     # Form onboarding quiz sau đăng ký
│   ├── teacher-profile-form.tsx # Form chỉnh sửa profile GV
│   ├── profile/                # Components cho profile page
│   ├── roadmap/                # AI health roadmap components
│   ├── teacher/                # Teacher-specific components
│   └── video/                  # LiveKit video components
├── lib/                        # Utilities và business logic
│   ├── supabase.ts             # Supabase client (browser, public anon key)
│   ├── ai/                     # AI helper modules
│   ├── ai-recommendation.ts    # AI class recommendation logic
│   ├── health-score.ts         # Health score calculation
│   ├── notifications.ts        # Notification helpers
│   ├── types.ts                # Shared TypeScript types
│   └── utils.ts                # cn() utility (clsx + tailwind-merge)
├── utils/                      # Supabase SSR helpers
│   ├── supabase/
│   │   ├── client.ts           # createClient() — dùng trong "use client" components
│   │   ├── server.ts           # createClient() — dùng trong Server Components / Actions
│   │   └── middleware.ts       # updateSession() — refresh cookie session
├── scripts/
│   └── seedData.ts             # Seed script, chạy bằng `npm run seed`
├── supabase/                   # SQL migrations và schema
│   ├── schema.sql              # Base schema
│   ├── migrations.sql          # All migrations
│   └── *.sql                   # Feature-specific SQL files
└── public/                     # Static assets
    └── YogAI-logo.png          # Logo chính
```

---

## 3. Role & Auth Flow

### Roles
- `student` — học viên, default role khi đăng ký
- `teacher` — giáo viên, chọn khi đăng ký

Role được lưu trong cột `role` của bảng `public.users` (mirror của Supabase Auth user_metadata).

### Login Flow (sau khi submit form `/login`)
```
login() [Server Action: app/actions/auth.ts]
  → supabase.auth.signInWithPassword()
  → query public.users để lấy role
    → role === 'teacher'  → redirect('/teacher')
    → role === 'student'
        → query onboarding_quiz
          → quiz chưa có → redirect('/register/quiz')
          → quiz đã có   → redirect('/student')
```

### Signup Flow
```
signup() [Server Action: app/actions/auth.ts]
  → supabase.auth.signUp()
  → insert vào public.users với role
    → role === 'teacher' → redirect('/teacher')
    → role === 'student' → redirect('/register/quiz')
```

### Middleware
File: `utils/supabase/middleware.ts` — hàm `updateSession()`.

> **Lưu ý quan trọng:** Middleware chỉ bảo vệ các route legacy (`/student-dashboard`, `/teacher-dashboard`, `/onboarding`, `/recommendation`). Các route `/student/*` và `/teacher/*` hiện tại **KHÔNG có middleware bảo vệ** — auth check thực hiện trực tiếp trong từng Server Component bằng `supabase.auth.getUser()`.

File `middleware.ts` ở root **KHÔNG tồn tại** — middleware helper nằm trong `utils/supabase/middleware.ts` nhưng cần được gọi từ root `middleware.ts` để hoạt động.

---

## 4. Design System

### Màu sắc (từ `app/globals.css` → `@theme`)

| Token CSS | Giá trị | Dùng cho |
|---|---|---|
| `--accent` | `#2E7DD1` | CTA button chính, active, link |
| `--accent-dark` | `#1A5FAD` | Hover trên accent |
| `--accent-tint` | `#E8F4FF` | Badge background |
| `--bg-base` | `#EEF6FF` | Nền trang |
| `--bg-sky` | `#E8F4FF` | Hero section, section xen kẽ |
| `--bg-surface` | `#FFFFFF` | Card, navbar, modal |
| `--text-primary` | `#0F2A4A` | Deep navy — text chính |
| `--text-secondary` | `#5E7A94` | Text phụ |
| `--text-muted` | `#93ADC2` | Label, placeholder |
| `--border` | `rgba(46,125,209,0.10)` | Viền mặc định |
| `--border-medium` | `rgba(46,125,209,0.18)` | Viền rõ hơn |
| `--border-strong` | `rgba(46,125,209,0.30)` | Focus, active border |

### Typography
- Font display (h1-h3, `.txt-title`): **DM Serif Display** — `var(--font-display)`
- Font UI (body, button, `.txt-content`): **DM Sans** — `var(--font-ui)`
- Font mono (label, code, `.txt-action`, `.label-mono`): **JetBrains Mono** — `var(--font-mono)`

Base font-size: `14px` (mobile) / `14.5px` (≥768px) — tất cả rem scale theo đây.

### Typography Utility Classes
- `.txt-title` — 1.35rem, DM Serif Display
- `.txt-content` — 0.9rem, DM Sans
- `.txt-action` — 0.75rem, JetBrains Mono, uppercase, bold (dùng cho label nhỏ)
- `.label-mono` — 11px, JetBrains Mono, uppercase (dùng trong HTML `<label>`)
- `.stats-value` — font-mono, clamp(20px-28px), màu accent

### Animation Classes (từ globals.css)
- `.blob-drift` — background orb floating (20s loop)
- `.card-float` — card floating up/down (4s loop)
- `.pulse-dot` — live indicator pulse (2s loop)
- `.bar-fill` — smooth width transition (1s)
- `.bar-fill` — smooth width transition (1s)
- `.btn-primary` — shimmer effect on hover (dùng trên Button CTA chính)
- `[data-reveal]` + `.visible` — scroll-reveal pattern

### Radius Tokens
- `--r-pill` → `100px`
- `--r-xl` → `20px`
- `--r-lg` → `14px`
- `--r-md` → `10px`

### UI Components (components/ui/)
`button`, `input`, `label`, `card`, `badge`, `dialog`, `textarea`, `progress`, `toast`, `form-error`, `datetime-picker`, `notification`

---

## 5. Conventions

### Đặt tên file
- Pages: `page.tsx` (theo Next.js App Router)
- Layout: `layout.tsx`
- Components: **kebab-case** (`dashboard-nav.tsx`, `teacher-profile-form.tsx`)
- Server Actions: gộp theo feature trong `app/actions/` (vd: `auth.ts`)
- API Route handlers: `route.ts` trong `app/api/[feature]/`

### Đặt tên Component
- **PascalCase** cho component function: `DashboardNav`, `TeacherProfileForm`
- Co-located nhỏ trong cùng file nếu chỉ dùng 1 lần

### Supabase Client — quan trọng
| Context | Import |
|---|---|
| `"use client"` component | `import { createClient } from "@/utils/supabase/client"` |
| Server Component / Route Handler | `import { createClient } from "@/utils/supabase/server"` + `await createClient()` |
| Browser (public, no auth) | `import { supabase } from "@/lib/supabase"` |

### Server Actions
- Khai báo `'use server'` ở đầu file
- Return type: `Promise<AuthResult>` hoặc plain object `{ error?: string }`
- Dùng `redirect()` từ `next/navigation` để điều hướng sau action
- Dùng `revalidatePath()` để invalidate cache

### TypeScript
- Không dùng `any` — dùng `unknown` hoặc type cụ thể
- Prop types inline cho component nhỏ, tách `interface` cho component lớn
- Dùng `cn()` từ `@/lib/utils` để merge classNames (clsx + tailwind-merge)

### API Response Format
- Route handlers tự định nghĩa format — chưa có chuẩn tập trung
- Phần lớn return `NextResponse.json({ data, error })`

---

## 6. Các file KHÔNG được sửa trực tiếp

| File | Lý do |
|---|---|
| `app/globals.css` | Design token gốc của toàn hệ thống — thay đổi ảnh hưởng toàn bộ UI |
| `app/layout.tsx` | Root layout, font registration, Toaster config |
| `utils/supabase/client.ts` | Supabase SSR client setup — sai là vỡ auth toàn app |
| `utils/supabase/server.ts` | Supabase SSR server client |
| `utils/supabase/middleware.ts` | Session refresh logic |
| `app/actions/auth.ts` | Core auth flow — login/signup/logout |
| `lib/supabase.ts` | Browser Supabase client (dùng anon key) |

---

## 7. Database Schema (các bảng chính)

| Bảng | Mô tả |
|---|---|
| `users` | User profile: `id`, `email`, `full_name`, `role` ('student'/'teacher'), `avatar_url` |
| `teacher_profiles` | Thông tin GV: `user_id`, `bio`, `specialties[]`, `certifications[]`, `years_experience` |
| `student_profiles` | Thông tin học viên (legacy schema — xem schema.sql) |
| `onboarding_quiz` | Bài quiz onboarding của học viên sau đăng ký |
| `courses` | Khóa học: `teacher_id`, `title`, `level`, `focus[]` |
| `class_sessions` | Buổi học cụ thể: `course_id`, `teacher_id`, `scheduled_at`, `status`, `livekit_room` |
| `bookings` | Đăng ký học: `student_id`, `session_id`, `status` |
| `session_feedback` | Phản hồi quiz sau buổi học: `session_id`, `student_id`, `rating`, ... |
| `ai_suggestions` | Gợi ý AI cho GV: `teacher_id`, `student_id`, `teacher_decision` |
| `streaks` | Streak tập luyện: `student_id` |
| `chat_messages` | Tin nhắn chat: `channel_id`, `user_id`, `content`, `reactions` |

---

## 8. Task thường gặp

### Thêm UI page mới cho student
1. Tạo file `app/student/[feature]/page.tsx`
2. Import `createClient` từ `@/utils/supabase/server`
3. Gọi `supabase.auth.getUser()` → redirect nếu không có user
4. Page tự động dùng layout `app/student/layout.tsx` (có Sidebar + BottomNav)

### Thêm UI page mới cho teacher
Tương tự trên nhưng trong `app/teacher/[feature]/page.tsx`

### Thêm API endpoint
1. Tạo `app/api/[feature]/route.ts`
2. Export `GET`, `POST`, v.v. theo Next.js route handler convention
3. Dùng `createClient` từ `@/utils/supabase/server`

### Thêm Server Action
1. Tạo hoặc thêm vào file trong `app/actions/`
2. Khai báo `'use server'` ở đầu file
3. Xử lý logic → return error object hoặc `redirect()`

### Thêm component UI mới
- Nếu dùng nhiều nơi → tạo trong `components/[name].tsx`
- Nếu chỉ dùng 1 page → co-locate trong cùng file `page.tsx`
- Dùng CSS variables (`var(--accent)`, `var(--text-primary)`, v.v.) thay vì hardcode màu
- Dùng `.txt-title`, `.txt-content`, `.txt-action` thay vì custom font-size

### Kiểm tra role của user (trong Server Component)
```ts
const { data: { user } } = await supabase.auth.getUser();
const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
const role = userData?.role; // 'student' | 'teacher'
```

### Thêm permission theo role (trong Server Component)
```ts
if (!user) redirect('/login');
if (userData?.role !== 'teacher') redirect('/student');
```

### Query rating trung bình của giáo viên
```ts
// Lấy tất cả session của GV, rồi query session_feedback
const { data: sessions } = await supabase.from('class_sessions').select('id').eq('teacher_id', teacherId);
const sessionIds = sessions?.map(s => s.id) ?? [];
const { data: feedbacks } = await supabase.from('session_feedback').select('rating').in('session_id', sessionIds).gt('rating', 0);
const avgRating = feedbacks ? feedbacks.reduce((a, c) => a + c.rating, 0) / feedbacks.length : 4.9;
```

---

## 9. Environment Variables

| Variable | Sử dụng |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (public) |
| `LIVEKIT_API_KEY` | LiveKit server key (server-only) |
| `LIVEKIT_API_SECRET` | LiveKit server secret (server-only) |
| `NEXT_PUBLIC_LIVEKIT_URL` | LiveKit WebSocket URL |
| Stripe keys | # TODO: xác nhận tên biến chính xác |
| OpenAI key | # TODO: xác nhận tên biến chính xác |
| Resend key | # TODO: xác nhận tên biến chính xác |

---

*Cập nhật lần cuối: 2026-03-25*
