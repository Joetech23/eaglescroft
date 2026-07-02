/** Renders JSON-LD structured data for rich results. Server component. */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON in a script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
