import { getLocalBusinessJsonLd } from '@/lib/structured-data';

export default function StructuredData() {
  const jsonLd = getLocalBusinessJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
