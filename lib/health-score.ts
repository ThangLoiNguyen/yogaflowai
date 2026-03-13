export type HealthSnapshot = {
  flexibility_score: number;
  strength_score: number;
  stress_level: number;
  attendance: number;
  created_at: string;
};

export function computeTrend(
  snapshots: HealthSnapshot[]
): { flexibilityDelta: number; stressDelta: number } {
  if (snapshots.length < 2) {
    return { flexibilityDelta: 0, stressDelta: 0 };
  }
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return {
    flexibilityDelta: last.flexibility_score - first.flexibility_score,
    stressDelta: first.stress_level - last.stress_level,
  };
}

