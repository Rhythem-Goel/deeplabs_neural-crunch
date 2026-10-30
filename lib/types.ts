export type Problem = {
  number: number
  title: string | null
  description: string | null
  category: string | null
  is_revealed: boolean
  revealed_at?: string | null
  pdf_url: string | null
}
