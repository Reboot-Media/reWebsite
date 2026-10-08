import { useEffect, useRef, useState } from 'react';
import { trackEvent } from './roofers/tracking.js';

// Self-hosted hero VSL. Set VSL_SRC to the MP4's public URL (Cloudflare R2)
// and VSL_POSTER to a still frame; until VSL_SRC is set the YouTube embed
// stays in place so the hero never goes blank.
const VSL_SRC = import.meta.env.VITE_VSL_SRC || '';
const VSL_POSTER = import.meta.env.VITE_VSL_POSTER || '';
const YOUTUBE_FALLBACK = 'https://www.youtube-nocookie.com/embed/OYPTmTF2lwE?rel=0&autoplay=1&mute=1&playsinline=1';

const MILESTONES = [25, 50, 75];
const frame = 'relative aspect-video overflow-hidden rounded-[20px] bg-brand-950 shadow-lift ring-8 ring-white';

export default function HeroVideo() {
  if (!VSL_SRC) {
    return (
      <div className={frame}>
        <iframe
          src={YOUTUBE_FALLBACK}
          title="How Reboot Media works"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }
  return <SelfHostedVideo />;
}

function SelfHostedVideo() {
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
        poster={VSL_POSTER || undefined}
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
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-brand-950/35 text-white transition hover:bg-brand-950/25"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-lift transition group-hover:scale-105 md:h-24 md:w-24">
            <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-white md:h-11 md:w-11" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className="rounded-full bg-brand-950/70 px-4 py-1.5 text-sm font-semibold tracking-tight">
            Watch with sound
          </span>
        </button>
      )}
    </div>
  );
}
