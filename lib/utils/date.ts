export function formatDate(value: string | null | undefined): string {
  if (!value) return '날짜 없음'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '날짜 없음'
  return d.toLocaleDateString('ko-KR')
}
