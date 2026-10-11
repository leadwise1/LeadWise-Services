import { UserAnswers, TraitScore, ProfessionMatch } from '../types';
import { QUESTIONS } from '../data/questions';
import { PROFESSIONS } from '../data/professions';

export function calculateTraitTotals(answers: UserAnswers): TraitScore {
  const totals: TraitScore = {
    analytical: 0,
    creative: 0,
    interpersonal: 0,
    technical: 0,
    leadership: 0,
    operational: 0,
  };

  Object.entries(answers).forEach(([questionId, optionId]) => {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    const selectedOption = question.options.find((opt) => opt.id === optionId);
    if (!selectedOption) return;

    Object.entries(selectedOption.traits).forEach(([traitKey, score]) => {
      if (traitKey in totals) {
        totals[traitKey as keyof TraitScore] += score;
      }
    });
  });

  // Calculate maximum potential for normalization
  const maxPossible = Math.max(...Object.values(totals), 120);

  // Normalize scores to scale of 100 for intuitive radar charts & bar displays
  const normalized: TraitScore = {
    analytical: Math.min(100, Math.round((totals.analytical / maxPossible) * 100 + 15)),
    creative: Math.min(100, Math.round((totals.creative / maxPossible) * 100 + 15)),
    interpersonal: Math.min(100, Math.round((totals.interpersonal / maxPossible) * 100 + 15)),
    technical: Math.min(100, Math.round((totals.technical / maxPossible) * 100 + 15)),
    leadership: Math.min(100, Math.round((totals.leadership / maxPossible) * 100 + 15)),
    operational: Math.min(100, Math.round((totals.operational / maxPossible) * 100 + 15)),
  };

  return normalized;
}

export function matchProfessions(userTraits: TraitScore): ProfessionMatch[] {
  const keys: (keyof TraitScore)[] = ['analytical', 'creative', 'interpersonal', 'technical', 'leadership', 'operational'];

  const scoredProfessions = PROFESSIONS.map((prof) => {
    // Vector similarity calculation (inverse Euclidean Distance normalized to percentage 60-98%)
    let sumSquaredDiff = 0;
    let userMag = 0;
    let profMag = 0;

    keys.forEach((key) => {
      const u = userTraits[key];
      const p = prof.traitScores[key];
      sumSquaredDiff += Math.pow(u - p, 2);
      userMag += Math.pow(u, 2);
      profMag += Math.pow(p, 2);
    });

    const distance = Math.sqrt(sumSquaredDiff);
    const maxDist = Math.sqrt(keys.length * Math.pow(100, 2));

    // Cosine similarity boost
    const dotProduct = keys.reduce((acc, k) => acc + userTraits[k] * prof.traitScores[k], 0);
    const cosSim = (userMag > 0 && profMag > 0) ? dotProduct / (Math.sqrt(userMag) * Math.sqrt(profMag)) : 0.7;

    // Blend metrics for a realistic 65% - 98% match scale
    const distFactor = 1 - (distance / maxDist);
    let matchPercentage = Math.round((distFactor * 0.4 + cosSim * 0.6) * 100);

    // Bound between 62% and 98%
    matchPercentage = Math.max(62, Math.min(98, matchPercentage));

    return {
      ...prof,
      matchPercentage,
    };
  });

  // Sort descending by match percentage
  return scoredProfessions.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
