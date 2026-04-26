import { StartWorkspace } from "@/components/start/start-workspace";

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ example?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialExampleId = Array.isArray(params.example)
    ? params.example[0]
    : params.example;

  return <StartWorkspace initialExampleId={initialExampleId ?? null} />;
}
