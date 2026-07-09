export function NavProgress({ active, accent }: { active: boolean; accent: string }) {
  if (!active) return null;
  return (
    <>
      <style>{`@keyframes nav-progress { 0% { left: -45%; width: 45%; } 100% { left: 100%; width: 45%; } }`}</style>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999, overflow: "hidden" }}>
        <div style={{ position: "absolute", height: "100%", background: accent, animation: "nav-progress 1s linear infinite" }} />
      </div>
    </>
  );
}
