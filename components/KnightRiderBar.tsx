export default function KnightRiderBar() {
  return (
    <div
      className="relative w-full h-2 rounded-full bg-slate-800/80 border border-white/5 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute top-0 left-0 w-[6rem] h-full rounded-full bg-gradient-to-r from-transparent via-accent-blue to-accent-violet opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-knight-rider-sweep"
      />
    </div>
  );
}
