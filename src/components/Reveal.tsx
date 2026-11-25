"use client";

/**
 * Fades its children up the first time they scroll into view.
 * Uses a ref callback (React 19 runs the returned cleanup on unmount)
 * instead of an effect, per the project's no-useEffect lint rule.
 */
function observe(el: HTMLDivElement | null) {
  if (!el) return;
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        el.classList.add("is-visible");
        io.disconnect();
      }
    },
    { threshold: 0.12 },
  );
  io.observe(el);
  return () => io.disconnect();
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div ref={observe} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
