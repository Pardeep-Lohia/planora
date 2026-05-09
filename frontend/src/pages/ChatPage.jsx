import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';


function bubbleStyles(role) {
  if (role === 'user') {
    return {
      background: 'rgba(59,130,246,.12)',
      border: '1px solid rgba(59,130,246,.22)',
      alignSelf: 'flex-end'
    };
  }

  return {
    background: 'rgba(255,255,255,.25)',
    border: '1px solid var(--border)',
    alignSelf: 'flex-start'
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      role: 'ai',
      text: 'Welcome to Planora Chat. Tell me what you need help with—focus, planning, or next steps.'
    }
  ]);
  const [draft, setDraft] = useState('I have a lot to do today—help me prioritize.');
  const [isThinking, setIsThinking] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo?.({ top: 999999, behavior: 'smooth' });
  }, [messages, isThinking]);

  const quickPrompts = useMemo(
    () => [
      'Give me a 15-minute focus plan.',
      'Turn my goals into 3 priorities.',
      'Help me break down a task into steps.'
    ],
    []
  );

  const generateAI = async (userText) => {
    setIsThinking(true);

    const lower = userText.toLowerCase();
    let response =
      "Here’s a simple way to prioritize: (1) pick the task with the biggest impact, (2) set a 25-minute focus block, (3) do the smallest next action.";

    if (lower.includes('priorit')) {
      response =
        'Priority shortcut: Identify outcome → choose 1 highest-leverage task → add a timebox (25–45 min) → schedule a quick review at the end.';
    } else if (lower.includes('15')) {
      response =
        '15-minute sprint: 5 min—clarify the next step, 10 min—work on it, 0–2 min—write down what to do next.';
    } else if (lower.includes('break') || lower.includes('steps')) {
      response =
        'Task breakdown: Define done-state → list 3–5 steps → order them by dependency → start with the easiest step to build momentum.';
    }

    await new Promise((r) => setTimeout(r, 650));
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: userText },
      { id: Date.now() + 1, role: 'ai', text: response }
    ]);
    setIsThinking(false);
  };

  const onSend = async () => {
    const text = draft.trim();
    if (!text || isThinking) return;
    setDraft('');
    // show user message immediately
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }]);
    // then AI reply
    const userText = text;
    await generateAI(userText);
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 950, fontSize: 28, letterSpacing: '-.4px' }}>Chat Assistant</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Focus, clarity, and next steps—AI-guided.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="ghost"
            onClick={() => {
              setMessages([{ id: 1, role: 'ai', text: 'Chat reset. What do you want to accomplish today?' }]);
            }}
            style={{ padding: '10px 12px' }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              height: 520,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              ref={listRef}
              style={{
                flex: 1,
                overflow: 'auto',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex' }}>
                  <div style={{ ...bubbleStyles(m.role), padding: 12, borderRadius: 16, maxWidth: 720 }}>
                    <div style={{ fontWeight: 900, marginBottom: 6, fontSize: 12, color: 'var(--muted)' }}>
                      {m.role === 'user' ? 'You' : 'Planora AI'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.text}</div>
                  </div>
                </div>
              ))}

              {isThinking ? (
                <div style={{ display: 'flex' }}>
                  <div style={{ background: 'rgba(255,255,255,.25)', border: '1px solid var(--border)', padding: 12, borderRadius: 16, maxWidth: 420 }}>
                    <div style={{ fontWeight: 900, marginBottom: 6, fontSize: 12, color: 'var(--muted)' }}>Planora AI</div>
                    <div className="muted" style={{ lineHeight: 1.6 }}>
                      Thinking…
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>
                    Ask for help
                  </div>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    className="input"
                    style={{ resize: 'none', lineHeight: 1.5, paddingTop: 10 }}
                    placeholder="e.g. Help me prioritize tasks"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                      }
                    }}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={onSend}
                  style={{ padding: '12px 14px', borderRadius: 14, minWidth: 120, opacity: isThinking ? 0.75 : 1 }}
                  disabled={isThinking}
                >
                  Send
                </Button>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    className="btn btnGhost"
                    onClick={() => setDraft(p)}
                    style={{ padding: '10px 12px' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

