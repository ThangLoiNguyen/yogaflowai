import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="rounded-[2.5rem] p-4 bg-white border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 group border-transparent hover:border-white">
      <CardHeader className="pb-2 px-6 pt-6">
        <CardTitle className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <p className="text-[13.5px] font-medium text-slate-400 group-hover:text-slate-500 leading-relaxed transition-colors">{description}</p>
      </CardContent>
    </Card>
  );
}
