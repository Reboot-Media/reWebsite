import { useEffect, useRef, useState } from 'react';
import { trackEvent } from './roofers/tracking.js';

// Self-hosted hero VSL (public/media). Re-encode new cuts with
// ffmpeg -crf 23 -maxrate 4M -movflags +faststart to stay under Pages' 25 MiB file limit.
const VSL_SRC = '/media/vsl.mp4';
const VSL_POSTER = '/media/vsl-poster.jpg';

const MILESTONES = [25, 50, 75];
const frame = 'relative aspect-video overflow-hidden rounded-[20px] bg-brand-950 shadow-lift ring-8 ring-white';

export default function HeroVideo() {
  const ref = useRef(null);
  // 'preview' = muted autoplay loop behind the play button; 'watching' = sound on, controls shown.
  const [mode, setMode] = useState('preview');
  const sent = useRef(new Set());

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  function startWatching() {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.loop = false;
    setMode('watching');
    v.play().catch(() => {});
    trackEvent('vsl_play');
  }

  function onTimeUpdate() {
    const v = ref.current;
    if (mode !== 'watching' || !v?.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    for (const m of MILESTONES) {
      if (pct >= m && !sent.current.has(m)) {
        sent.current.add(m);
        trackEvent('vsl_progress', { percent: m });
      }
    }
  }

  function onEnded() {
    if (mode === 'watching') trackEvent('vsl_complete');
  }

  return (
    <div className={frame}>
      <video
        ref={ref}
        src={VSL_SRC}
        poster={VSL_POSTER}
        muted
        loop={mode === 'preview'}
        playsInline
        preload="metadata"
        controls={mode === 'watching'}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />
      {mode === 'preview' && (
        <button
          type="button"
          onClick={startWatching}
          aria-label="Play video with sound"
          className="group absolute inset-0 flex items-start justify-start gap-3 bg-gradient-to-b from-brand-950/60 via-transparent to-transparent p-4 text-white md:p-6"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent shadow-lift transition group-hover:scale-105 md:h-16 md:w-16">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-7 w-7 fill-white md:h-8 md:w-8" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className="mt-3 rounded-full bg-brand-950/70 px-4 py-1.5 text-sm font-semibold tracking-tight md:mt-4">
            Watch with sound
          </span>
        </button>
      )}
    </div>
  );
}
