import Spinner from "@/components/Loaders/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 backdrop-blur-[2px]">
      <Spinner />
    </div>
  );
}