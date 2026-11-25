import profile from "@/data/profile.json";

export function PlaceholderBanner() {
  if (!(profile as { placeholder?: boolean }).placeholder) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm text-center px-4 py-2">
      Draft: career details below are placeholders until the real profile is added.
    </div>
  );
}
