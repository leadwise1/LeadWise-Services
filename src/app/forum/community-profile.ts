export function getCommunityName(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const community = JSON.parse(localStorage.getItem('leadwise_community_profile') || 'null');
    if (typeof community?.displayName === 'string' && community.displayName.trim()) return community.displayName.trim();
    const intake = JSON.parse(localStorage.getItem('leadwise_intake') || 'null');
    if (typeof intake?.firstName !== 'string' || !intake.firstName.trim()) return null;
    const initial = typeof intake.lastName === 'string' && intake.lastName ? `${intake.lastName.charAt(0)}.` : '';
    return [intake.firstName.trim(), initial].filter(Boolean).join(' ');
  } catch {
    return null;
  }
}
