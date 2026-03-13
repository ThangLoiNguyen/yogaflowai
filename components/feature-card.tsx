import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:bg-slate-50 hover:shadow-lg hover:shadow-sky-500/10 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900 dark:hover:shadow-sky-500/10">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-50">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </CardContent>
    </Card>
  );
}

