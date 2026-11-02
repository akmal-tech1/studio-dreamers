export function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) return `${minutes} min`;
  if (!minutes) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}
