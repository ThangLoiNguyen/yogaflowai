import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 dark:hover:border-sky-900/50 dark:hover:bg-slate-900 dark:hover:shadow-sky-500/10 group">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900 group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-sky-400 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

