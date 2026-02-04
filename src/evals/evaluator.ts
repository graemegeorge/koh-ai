export interface EvaluationResult {
  passed: boolean;
  reasons: string[];
}

export function evaluateAnswer(answer: string): EvaluationResult {
  const reasons: string[] = [];

  if (!answer.toLowerCase().includes("assumption")) {
    reasons.push("Answer should include assumptions.");
  }

  if (!answer.toLowerCase().includes("recommend")) {
    reasons.push("Answer should include recommendations.");
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
}
