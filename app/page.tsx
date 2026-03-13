import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { StudentProgress } from "@/components/student-progress";
import { TeacherAnalytics } from "@/components/teacher-analytics";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  mockStudentProgress,
  mockTeacherAnalytics,
  mockRecommendations,
} from "@/lib/mock-data";

export default function LandingPage() {
  const primaryRec = mockRecommendations[0];

  return (
    <main className="flex-1 bg-gradient-to-b from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-indigo-400 to-cyan-400">
              <span className="text-sm font-semibold text-white">YF</span>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
              YogaFlow AI
            </span>
          </div>
          <div className="hidden items-center gap-4 text-sm text-slate-600 dark:text-slate-300 md:flex">
            <Link href="#features" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Tính năng
            </Link>
            <Link href="#product" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Sản phẩm
            </Link>
            <Link href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Bảng giá
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="border-sky-500/40 bg-white text-slate-700 hover:bg-slate-50 dark:border-sky-400/40 dark:bg-slate-900/40 dark:text-slate-50 dark:hover:bg-slate-900"
              >
                Đăng nhập
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <HeroSection />

        <section id="features" className="mt-16 space-y-8">
          <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300">
            Xây dựng cho hành trình yoga hiện đại
          </Badge>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Tư vấn lớp học bằng AI"
              description="Phân tích dữ liệu sức khỏe và mục tiêu để đề xuất các lớp học phù hợp nhất với cơ thể và lịch trình của học viên."
            />
            <FeatureCard
              title="Theo dõi sức khỏe & tiến độ"
              description="Theo dõi độ dẻo dai, sức mạnh, sự cân bằng và tình trạng sức khỏe tổng thể qua từng tuần và từng tháng—một cách trực quan và dễ dàng."
            />
            <FeatureCard
              title="Bảng điều khiển cho giáo viên"
              description="Giúp giáo viên có cái nhìn rõ ràng về tiến bộ, mức độ tương tác và xu hướng học tập của học viên trong các lớp học."
            />
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-slate-50">
                Vấn đề học viên hiện nay gặp phải
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Hầu hết người học yoga tự đoán trình độ của mình. Họ phân vân giữa lớp cơ bản và trung bình, không chắc mình đang tập quá sức hay chưa đủ.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Thật khó để tìm trình độ lớp học phù hợp với cơ thể.</li>
                <li>Tiến độ không rõ ràng—không có cách nào để theo dõi sự cải thiện.</li>
                <li>Học viên hiếm khi hiểu cơ thể họ thực sự thay đổi ra sao.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-500/20 bg-slate-50 shadow-lg shadow-sky-500/10 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-slate-50">
                YogaFlow AI thay đổi hành trình của bạn như thế nào
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                YogaFlow AI sử dụng dữ liệu sức khỏe và luyện tập để đưa ra đề xuất cá nhân hóa, thiết kế sát với thể trạng thực tế của bạn.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Gợi ý lớp học bằng AI dựa trên sức khoẻ, mục tiêu, và lịch sử thực hành.</li>
                <li>Bảng điều khiển đẹp, đơn giản để theo dõi tiến độ theo thời gian thực.</li>
                <li>Phân tích thông minh giúp giáo viên dễ dàng điều chỉnh lịch trình lớp học.</li>
              </ul>
              <p className="text-sky-600 dark:text-sky-400 font-medium">
                Bớt phân vân. Tập trung hiện tại. Những bài tập yoga được thiết kế dành riêng cho bạn.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="product" className="mt-20 space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Tổng quan sản phẩm
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Góc nhìn toàn diện cho học viên và giáo viên—tích hợp đề xuất, tiến độ, và dữ liệu phân tích tại một nơi duy nhất.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-slate-200">
                  Tổng quan tiến độ học viên
                  <span className="text-xs text-slate-500 dark:text-slate-400">Xem trước</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudentProgress data={mockStudentProgress} compact />
              </CardContent>
            </Card>

            <Card className="border-sky-500/20 bg-slate-50 shadow-sm dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Đề xuất lớp học AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendationCard recommendation={primaryRec} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-slate-200">
                Phân tích cho giáo viên
                <span className="text-xs text-slate-500 dark:text-slate-400">Tổng quan Studio</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeacherAnalytics data={mockTeacherAnalytics} compact />
            </CardContent>
          </Card>
        </section>

        <section id="pricing" className="mt-20">
          <div className="mb-8 max-w-xl space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Bảng giá đơn giản cho mọi nhu cầu
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Bắt đầu miễn phí cho học viên. Nâng cấp khi studio hoặc quy mô giảng dạy của bạn sẵn sàng mở rộng.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Cơ bản
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Dành cho học viên cá nhân
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Miễn phí
                  <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                    mãi mãi
                  </span>
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Đề xuất lớp học cá nhân hóa</li>
                  <li>• Theo dõi tiến bộ cơ bản</li>
                  <li>• Tối đa 3 mục tiêu</li>
                </ul>
                <Link href="/onboarding">
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700">
                    Bắt đầu với vai trò học viên
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-sky-500/40 bg-sky-50/50 shadow-md shadow-sky-500/10 dark:bg-slate-900/80 dark:shadow-sky-500/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">Chuyên nghiệp</span>
                  <Badge className="bg-sky-500 text-white dark:bg-sky-500 dark:text-slate-950 border-transparent">
                    Phổ biến nhất
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  $19
                  <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                    /tháng
                  </span>
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Đề xuất không giới hạn</li>
                  <li>• Phân tích chuyên sâu về sức khỏe</li>
                  <li>• Tích hợp thiết bị đeo (sắp ra mắt)</li>
                </ul>
                <Link href="/onboarding">
                  <Button className="w-full bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400">
                    Nâng cấp lên Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Studio
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Dành cho giáo viên & studio
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  $79
                  <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                    /tháng
                  </span>
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Bảng phân tích giáo viên</li>
                  <li>• Hiệu năng lớp học & độ chuyên cần</li>
                  <li>• Hồ sơ học viên không giới hạn</li>
                </ul>
                <Link href="/teacher-dashboard">
                  <Button
                    variant="outline"
                    className="w-full border-sky-500/40 text-sky-600 hover:bg-slate-50 dark:text-sky-300 dark:hover:bg-slate-900"
                  >
                    Liên hệ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="cta" className="mt-20">
          <Card className="border-sky-500/30 bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-cyan-500/10 dark:from-sky-500/15 dark:via-indigo-500/10 dark:to-cyan-500/15 shadow-sm">
            <CardContent className="flex flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Bắt đầu hành trình yoga của riêng bạn
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-200">
                  Trả lời một số câu hỏi và để YogaFlow AI tìm lớp học phù hợp với cơ thể bạn.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/onboarding">
                  <Button className="bg-sky-500 text-white hover:bg-sky-600 dark:text-slate-950 dark:hover:bg-sky-400">
                    Bắt đầu (Học viên)
                  </Button>
                </Link>
                <Link href="/teacher-dashboard">
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-200/30 dark:bg-transparent dark:text-slate-50 dark:hover:bg-slate-900"
                  >
                    Giáo viên yoga
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} YogaFlow AI. Đã đăng ký bản quyền.</p>
            <div className="flex gap-4">
              <button className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Bảo mật</button>
              <button className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Điều khoản</button>
              <button className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Hỗ trợ</button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

