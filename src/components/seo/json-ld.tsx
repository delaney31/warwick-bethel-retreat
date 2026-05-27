type JsonLdPayload = Record<string, unknown>;

interface JsonLdProps {
  data: JsonLdPayload | JsonLdPayload[];
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
