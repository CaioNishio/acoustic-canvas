import { useEffect, useRef, useState } from 'react';

/** SVG image has no native loading=lazy. Keep its crop/layout, defer only bytes. */
export default function DeferredSvgImage({ href, width, height }: { href: string; width: string; height: string }) {
  const ref = useRef<SVGImageElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const viewport = ref.current?.ownerSVGElement;
    if (!viewport || !('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: '600px' });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);
  return <image ref={ref} href={ready ? href : undefined} width={width} height={height} />;
}
