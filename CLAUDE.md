# CLAUDE.md — YogAI Project Reference

> Tài liệu tham chiếu nội bộ dành cho AI agents làm việc trên codebase này.  
> Chỉ ghi những gì **thực sự có** trong project. Mục không rõ ghi `# TODO: cần xác nhận`.

---

## 1. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | `reactCompiler: true`. Dùng `proxy.ts` cho middleware. |
| Language | **TypeScript 5** | Strict mode |
| Styling | **Tailwind CSS v4** | Config via `@theme` trong globals.css — không có tailwind.config.ts |
| Icons | **lucide-react** | |
| Auth | **Supabase Auth** (`@supabase/ssr`) | Cookie-based, SSR-safe |
| Database | **Supabase** (PostgreSQL) | Client-side: `lib/supabase.ts`, Server-side: `utils/supabase/server.ts` |
| AI | **OpenAI** (`openai` ^4.73) | Dùng trong `lib/ai/`, `app/api/ai/` |
| Video/Live | **LiveKit** (`livekit-client`, `livekit-server-sdk`) | WebRTC live streaming |
| Charts | **Recharts** | Dùng trong analytics |
| Payments | **Stripe** | `@stripe/react-stripe-js`, webhook handler ở `app/api/webhook/` |
| Email | **Resend** | |
| Fonts | **DM Serif Display**, **DM Sans**, **JetBrains Mono** | Google Fonts, inject qua `app/layout.tsx` |

---

## 2. Cấu trúc thư mục

```
yogaflow-ai/
├── app/                        # Next.js App Router — pages và API
│   ├── (session)/              # Route group cho live session
│   ├── actions/                # Server Actions (auth.ts, v.v.)
│   ├── api/                    # Route handlers (ai, livekit, checkout, v.v.)
│   ├── student/                # Dashboard học viên (protected)
│   ├── teacher/                # Dashboard giáo viên (protected)
│   ├── login/                  # Trang đăng nhập
│   ├── register/               # Trang đăng ký
│   ├── globals.css             # Design tokens (@theme) và global styles
│   └── layout.tsx              # Root layout và providers
├── components/                 # Shared React components
│   ├── ui/                     # shadcn/ui primitives
│   ├── profile/                # Profile-related components
│   ├── roadmap/                # AI roadmap components
│   └── video/                  # LiveKit video components (LiveRoom.tsx, v.v.)
├── lib/                        # Business logic và helpers
│   ├── ai/                     # AI modules
│   ├── supabase.ts             # Browser Supabase client (anon key)
│   └── utils.ts                # cn() helper
├── utils/                      # Supabase SSR helpers
│   └── supabase/               # server.ts, client.ts, middleware.ts
├── supabase/                   # SQL schema và migrations
├── public/                     # Static assets (logos, images)
└── package.json                # Dependencies và scripts
```

---

## 3. Role & Auth Flow

### Roles
- `student`: Mặc định khi đăng ký. Truy cập `/student/*`.
- `teacher`: Chọn khi đăng ký. Truy cập `/teacher/*`.
Role lưu trong bảng `public.users.role`.

### Auth Flow & Redirects
- **Sau Login**: `app/actions/auth.ts` kiểm tra role:
  - Nếu `teacher` → `/teacher`
  - Nếu `student` → kiểm tra `onboarding_quiz`:
    - Đã xong → `/student`
    - Chưa xong → `/register/quiz`
- **Middleware Check**: `utils/supabase/middleware.ts` tự động redirect nếu truy cập trái phép hoặc chưa đăng nhập.

---

## 4. Design System (từ globals.css)

### Màu sắc chính
- `--accent`: `#2E7DD1` (Blue — Primary CTA)
- `--text-primary`: `#0F2A4A` (Deep Navy)
- `--bg-base`: `#EEF6FF` (Light Sky — Page BG)

### Typography Classes
- `.txt-title`: DM Serif Display, `1.35rem`
- `.txt-content`: DM Sans, `0.9rem`
- `.txt-action`: JetBrains Mono, `0.75rem`, Bold
- `.label-mono`: JetBrains Mono, `11px`, Uppercase

### Convention UI
- **Compact UI**: `font-size` gốc của `html` được đặt là `14px` (`14.5px` trên desktop) để thu nhỏ toàn bộ tỉ lệ rem (padding, margin, font) giúp giao diện tinh gọn hơn.
- **Glassmorphism**: Dùng `.glass-panel` (backdrop-blur) cho navbar và modal.

---

## 5. Conventions

- **Component**: PascalCase, đặt trong `components/` hoặc co-locate nếu dùng 1 lần.
- **Server Action**: Luôn có `'use server'`, return object `{ error?: string, data?: any }`.
- **Supabase Usage**:
  - `use client`: `import { createClient } from "@/utils/supabase/client"`
  - Server Component: `import { createClient } from "@/utils/supabase/server"`
- **Live Stream**: Handover phần cứng cần delay ít nhất **400ms** khi chuyển từ Lobby sang Live để tránh lỗi truy cập camera.
- **Video Mirror**: Mặc định áp dụng `scaleX(-1)` cho tất cả video cá nhân (Selfie Mode).

---

## 6. Các file KHÔNG được sửa trực tiếp

- `app/globals.css`: Chứa design tokens gốc.
- `utils/supabase/*.ts`: Các helper khởi tạo Supabase Client.
- `app/actions/auth.ts`: Chứa logic điều hướng cốt lõi sau đăng nhập.
- `supabase/migrations.sql`: File source of truth cho database schema.

---

## 7. Database Schema (chính)

- `users`: Thông tin cơ bản và role.
- `teacher_profiles`: Chứng chỉ, kinh nghiệm của GV.
- `courses` & `class_sessions`: Quản lý lớp học và buổi live.
- `onboarding_quiz`: Dữ liệu đầu vào của học viên (Source of truth cho AI).
- `session_quiz`: Feedback sau buổi học để AI điều chỉnh lộ trình.
- `streaks`: Theo dõi chuyên cần của học viên.

---

## 8. Task thường gặp

- **Thêm trang Dashboard**: Tạo trong `app/student/` hoặc `app/teacher/`.
- **Thêm API**: Tạo trong `app/api/`. Luôn dùng `createClient` từ server util.
- **Thêm UI Component**: Dùng Tailwind v4 biến `@theme`. Ưu tiên dùng các class `.txt-*` để đồng bộ typography.
- **Sửa database**: Viết SQL migration mới trong `supabase/` và cập nhật `migrations.sql`.

---

## 9. Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `NEXT_PUBLIC_LIVEKIT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`

---

## 10. Known Issues & Gotchas

- **Auth check**: `proxy.ts` phải query bảng `onboarding_quiz` để check trạng thái hoàn thành bài quiz, **KHÔNG** dùng `student_profiles` (legacy).
- **Navigation**: Khi submit quiz xong, phải dùng `redirect()` từ **Server Action** để đảm bảo middleware/proxy nhận diện được thay đổi cookie, không dùng `router.push()` từ phía client.
- **Phần cứng (Camera/Mic)**: Live stream cần delay ít nhất **400ms** khi chuyển từ Lobby sang Live để đảm bảo trình duyệt giải phóng thiết bị cũ.
- **Mirroring**: Video cá nhân của học viên/giáo viên mặc định áp dụng `scaleX(-1)` (Selfie Mode) để tạo cảm giác tự nhiên như soi gương.

---
*Cập nhật lần cuối: 2026-03-25*
