import React, { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

const DEFAULT_TIMES = ['09:00', '10:30', '12:30', '14:30', '16:00', '17:30'];

function TimelineItem({ time, text, tone }) {
  const dotBg =
    tone === 'success'
      ? 'rgba(34,197,94,.95)'
      : tone === 'warning'
        ? 'rgba(245,158,11,.95)'
        : 'rgba(59,130,246,.95)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 14, alignItems: 'start' }}>
      <div style={{ fontWeight: 900, color: 'var(--muted)', fontSize: 13 }}>{time}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ marginTop: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: dotBg,
              boxShadow: `0 0 0 5px ${dotBg.replace(',.95', ',.18').replace(',.98', ',.18')}`
            }}
          />
        </div>
        <div style={{ padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(255,255,255,.25)' }}>
          <div style={{ fontWeight: 900 }}>{text}</div>
          <div className="muted" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4 }}>
            AI-suggested focus block
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const [goals, setGoals] = useState('Finish sprint tasks, stay focused, and take a short walk.');
  const [items, setItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const tones = useMemo(() => ['primary', 'success', 'warning', 'primary', 'success', 'primary'], []);

  const generate = async () => {
    setIsGenerating(true);

    // Mock "AI" generation
    const base = goals
      .split(/[\n,\.]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const goalBullets = base.length ? base : ['Focus on the right tasks', 'Move one task forward', 'Protect energy'];

    const next = DEFAULT_TIMES.map((time, idx) => {
      const g = goalBullets[idx % goalBullets.length];
      const verbs = ['Plan', 'Deep work', 'Execute', 'Review', 'Optimize', 'Wind down'];
      const v = verbs[idx % verbs.length];
      const cleaned = g.replace(/^[-*\s]+/, '');
      return {
        time,
        text: `${v}: ${cleaned[0].toUpperCase() + cleaned.slice(1)}`,
        tone: tones[idx]
      };
    });

    await new Promise((r) => setTimeout(r, 650));
    setItems(next);
    setIsGenerating(false);
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 950, fontSize: 28, letterSpacing: '-.4px' }}>AI Daily Planner</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Turn goals into a clean timeline you can follow.
          </div>
        </div>
        <Button variant="primary" onClick={generate} disabled={isGenerating} style={{ padding: '11px 14px', opacity: isGenerating ? 0.75 : 1 }}>
          {isGenerating ? 'Generating…' : 'Generate Plan'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Your goals</div>
          <div className="muted" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
            Write what matters today. Separate by commas or new lines.
          </div>

          <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
            <label>
              <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Goals</div>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={9}
                className="input"
                style={{ resize: 'vertical', paddingTop: 12, lineHeight: 1.5 }}
                placeholder="e.g. Finish report, call client, and go for a walk"
              />
            </label>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="ghost" onClick={() => setGoals('Finish sprint tasks, stay focused, and take a short walk.')}>Example</Button>
              <Button variant="ghost" onClick={() => setItems([])}>Clear output</Button>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900 }}>Schedule</div>
              <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                A timeline view you can follow block-by-block.
              </div>
            </div>
            <div className="badge">AI timeline</div>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
            {items.length ? (
              items.map((it, idx) => <TimelineItem key={idx} time={it.time} text={it.text} tone={it.tone} />)
            ) : (
              <div className="muted" style={{ padding: 14, lineHeight: 1.6 }}>
                Click <b>Generate Plan</b> to create your daily schedule.
              </div>
            )}
          </div>

          {items.length ? (
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={() => {
                  // mock: copy to clipboard
                  const text = items.map((i) => `${i.time} - ${i.text}`).join('\n');
                  navigator.clipboard?.writeText?.(text);
                }}
                style={{ padding: '10px 12px' }}
              >
                Copy timeline
              </Button>
              <Button variant="ghost" onClick={() => window.location.href = '/app/tasks'} style={{ padding: '10px 12px' }}>
                Add to tasks
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

