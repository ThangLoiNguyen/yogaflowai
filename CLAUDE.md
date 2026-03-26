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

## 4. Design System (Sky Tone — Wellness Aesthetic)

### Màu sắc chính (Cập nhật 2026-03-26)
- `--accent`: `#0ea5e9` (Sky-500 — Primary CTA)
- `--bg-base`: `#f8fafc` (Slate-50 — Page Background)
- `--bg-sky`: `#f0f9ff` (Sky-50 — Accent Tint)
- `--text-primary`: `#0f172a` (Slate-900)
- `--text-secondary`: `#475569` (Slate-600)

### Typography Classes (Cập nhật 2026-03-26)
- **KHÔNG DÙNG CHỮ NGHIÊNG (ITALIC)**: Toàn bộ hệ thống đã chuyển sang phông đứng để tăng tính chuyên nghiệp.
- `.txt-title`: DM Serif Display, `1.35rem`, font-black, leading-tight
- `.txt-content`: DM Sans, `0.9rem`, variant straight/upright (đã bỏ italic)
- `.txt-action`: JetBrains Mono, `0.75rem`, font-black, Uppercase, tracking-widest
- `.label-mono`: JetBrains Mono, `11px`, Uppercase, tracking-widest, text-slate-400

### Convention UI & Layout
- **Giao diện cô đọng (High Density)**: Thẻ lớp học dùng lưới 4 cột (Explore), thu nhỏ padding và icon.
- **Thẻ khóa học (Course Cards)**: Không dùng ảnh placeholder, sử dụng **mô tả (description)** được thiết kế thành mảng chữ lớn làm visual chính.
- **Chat/Messages**: Chiều cao PC cố định `h-[calc(100vh-5rem)]`, có hiệu ứng bóng đổ (`shadow`) ngăn cách Header và Content.
- **Bo góc**: Sử dụng `rounded-3xl` hoặc `rounded-[2.5rem]` cho các card lớn.
- **Màu sắc**: Sky Blue `#0ea5e9` làm điểm nhấn, Slate-900 làm nền cho các phần quan trọng (AI Panel).

---

## 5. Conventions

- **Component**: PascalCase, đặt trong `components/` hoặc co-locate nếu dùng 1 lần.
- **Server Action**: Luôn có `'use server'`, return object `{ error?: string, data?: any }`.
- **Supabase Usage**:
  - `use client`: `import { createClient } from "@/utils/supabase/client"`
  - Server Component: `import { createClient } from "@/utils/supabase/server"`
- **Live Stream**: Chuyển đổi trực tiếp từ Lobby sang Live (0ms delay) trong `joinRoom`.
- **Video Mirror**: Mặc định áp dụng `scaleX(-1)` cho tất cả video cá nhân (Selfie Mode).
- **Streak Logic**: Cập nhật mỗi ngày thông qua `/api/ai/analyze-quiz/` khi học viên gửi feedback.

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
- `session_quiz`: Feedback sau buổi học.
- `ai_suggestions`: Gợi ý từ AI dành cho giáo viên dựa trên session feedback.
- `progress_logs`: Nhật ký tiến độ học tập.
- `streaks`: Theo dõi chuỗi tập luyện chuyên cần (Cập nhật thành công mỗi ngày).

---

## 8. Task thường gặp

- **Thêm trang Dashboard**: Tạo trong `app/student/` hoặc `app/teacher/`.
- **Thêm API**: Tạo trong `app/api/`. Luôn dùng `createClient` từ server util.
- **Thêm UI Component**: Dùng Tailwind v4 biến `@theme`. Ưu tiên dùng các class `.txt-*` để đồng bộ typography.
- **Cập nhật UI**: Luôn tuân thủ hệ màu **Sky Blue & Slate** để giữ tính wellness.

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
- **Navigation**: Khi submit quiz xong, phải dùng `redirect()` từ **Server Action** để đảm bảo middleware/proxy nhận diện được thay đổi cookie.
- **Hardware Delay**: Hiện đã gỡ bỏ 400ms delay trong `LiveRoom.tsx` để tối ưu tốc độ tham gia (User request).
- **Streak Double-count**: Logic streak trong `analyze-quiz` đã chặn việc cộng dồn nhiều lần trong cùng một ngày.
- **Visual Design**: Các thẻ Card lộ trình (Explore) và đề xuất (Dashboard) hiện ưu tiên hiển thị text mô tả thay cho ảnh giáo viên hoặc ảnh minh họa.

---
*Cập nhật lần cuối: 2026-03-26 (Bởi Antigravity AI)*
