import Script from 'next/script'

export function JSONLD({ data }: { data: any }) {
  return (
    <Script
      id={`json-ld-${Math.random()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
