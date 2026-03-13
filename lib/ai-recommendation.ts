import OpenAI from "openai";
import type { Tables } from "./types";

const openai = new OpenAI();
// Ensure process.env.OPENAI_API_KEY is set in .env.local

type StudentProfile = {
  yoga_experience: string | null;
  health_conditions: string | null;
  goals: string[] | null;
};

type Course = Tables["courses"];

export async function recommendClasses(
  studentProfile: StudentProfile,
  courses: Course[]
) {
  const goals = (studentProfile.goals ?? []).map((g) => g.toLowerCase());
  const experience = (studentProfile.yoga_experience ?? "").toLowerCase();
  const hasInjury =
    (studentProfile.health_conditions ?? "")
      .toLowerCase()
      .includes("injury") || false;

  const scored = courses.map((course) => {
    let score = 0;

    const level = (course.level ?? "").toLowerCase();
    if (experience.includes("beginner") && level.includes("1")) score += 3;
    if (experience.includes("intermediate") && level.includes("2")) score += 3;
    if (experience.includes("advanced") && level.includes("3")) score += 3;

    const focus = (course.focus ?? []).map((f) => f.toLowerCase());
    goals.forEach((goal) => {
      if (goal.includes("flexibility") && focus.includes("flexibility")) {
        score += 4;
      }
      if (goal.includes("strength") && focus.includes("strength")) {
        score += 4;
      }
      if (
        (goal.includes("stress") || goal.includes("relax")) &&
        (focus.includes("relaxation") || focus.includes("recovery"))
      ) {
        score += 4;
      }
    });

    if (hasInjury && focus.includes("recovery")) {
      score += 2;
    }

    // Normalize to 0-100 logic just for display
    return { course, score: Math.min(100, Math.max(0, score * 10 + 50)) };
  });

  const topCourses = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => ({ ...s.course, heuristicScore: s.score }));

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an AI yoga recommendation engine. 
Given the student's profile and top recommended yoga classes, return a JSON object with a 'recommendations' array.
Each element MUST EXACTLY follow this structure to match the frontend expectations:
{
  "id": "string (the course id)",
  "course": "string (the course title)",
  "score": "number (the heuristic score, optionally improved 1-100)",
  "explanation": "string (short personalized explanation based on goals/experience)",
  "level": "string (the course level)",
  "duration": "string (e.g. '45 min')",
  "focus": ["string (focus tag)"],
  "intensity": "Gentle" | "Moderate" | "Dynamic"
}
Output valid JSON only.`,
        },
        {
          role: "user",
          content: `Student Profile: ${JSON.stringify(studentProfile)}
Top Classes: ${JSON.stringify(topCourses)}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      return parsed.recommendations;
    }
  } catch (error) {
    console.error("OpenAI Error:", error);
    // fallback
  }

  return topCourses.map((c) => ({
    id: c.id,
    course: c.title,
    level: c.level || "All levels",
    duration: "45 min", // default
    focus: c.focus || [],
    intensity: "Moderate",
    score: c.heuristicScore,
    explanation: "Recommended based on your recent answers.",
  }));
}
