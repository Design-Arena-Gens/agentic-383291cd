'use client';

import { useEffect, useState } from 'react';

type TimeResponse = {
  iso: string;
  epochMs: number;
  timezone: string;
};

export default function Page() {
  const [now, setNow] = useState<TimeResponse | null>(null);
  const [logs, setLogs] = useState<TimeResponse[]>([]);
  const [tickSeconds, setTickSeconds] = useState<number>(0);

  async function fetchTime() {
    try {
      const res = await fetch('/api/time', { cache: 'no-store' });
      const data: TimeResponse = await res.json();
      setNow(data);
      setLogs(prev => [{ ...data }, ...prev].slice(0, 100));
    } catch (err) {
      // ignore transient errors; page is resilient
    }
  }

  useEffect(() => {
    fetchTime(); // initial

    const intervalMs = 5 * 60 * 1000; // 5 minutes
    const intervalId = setInterval(fetchTime, intervalMs);

    // lightweight seconds ticker for UX feedback
    const secondsTicker = setInterval(() => {
      setTickSeconds(prev => (prev + 1) % (intervalMs / 1000));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(secondsTicker);
    };
  }, []);

  const secondsUntilNext = (5 * 60) - (tickSeconds % (5 * 60));

  return (
    <main style={{
      maxWidth: 720,
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      <h1 style={{ fontSize: 28, margin: '0 0 8px' }}>Time Fetcher</h1>
      <p style={{ marginTop: 0, color: '#9fb2d0' }}>
        Automatically fetches current time every 5 minutes and prints below.
      </p>

      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginTop: 24,
      }}>
        <div style={{
          background: '#111936',
          border: '1px solid #1e2a4a',
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ color: '#9fb2d0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>Current</div>
          <div style={{ fontSize: 14, marginTop: 8, color: '#cfe0ff' }}>ISO</div>
          <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 16, marginTop: 4 }}>
            {now ? now.iso : '?'}
          </div>
          <div style={{ fontSize: 14, marginTop: 12, color: '#cfe0ff' }}>Epoch (ms)</div>
          <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 16, marginTop: 4 }}>
            {now ? now.epochMs : '?'}
          </div>
          <div style={{ fontSize: 14, marginTop: 12, color: '#cfe0ff' }}>Timezone</div>
          <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 16, marginTop: 4 }}>
            {now ? now.timezone : '?'}
          </div>
          <div style={{ marginTop: 16, color: '#9fb2d0' }}>
            Next fetch in ~{secondsUntilNext}s
          </div>
        </div>

        <div style={{
          background: '#111936',
          border: '1px solid #1e2a4a',
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ color: '#9fb2d0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>Controls</div>
            <button
              onClick={fetchTime}
              style={{
                background: '#2b8a3e',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >Fetch now</button>
          </div>

          <div style={{ marginTop: 12, color: '#9fb2d0', fontSize: 14 }}>
            Interval: every 5 minutes (300,000 ms)
          </div>
        </div>
      </section>

      <section style={{
        marginTop: 24,
        background: '#0d152b',
        border: '1px solid #1e2a4a',
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '12px 16px',
          background: '#0b1328',
          color: '#9fb2d0',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 0.6
        }}>Print Log</div>
        <div style={{ maxHeight: 360, overflow: 'auto' }}>
          {logs.length === 0 ? (
            <div style={{ padding: 16, color: '#9fb2d0' }}>No entries yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {logs.map((t, idx) => (
                <li key={t.epochMs + '-' + idx} style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #1b2746',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 16,
                  alignItems: 'center'
                }}>
                  <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                    {t.iso}
                  </div>
                  <div style={{ color: '#9fb2d0', fontSize: 12 }}>
                    {t.epochMs} ? {t.timezone}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
