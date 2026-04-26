export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-red-900 bg-red-950/40 p-6 text-red-100">
      {message}
    </div>
  );
}
