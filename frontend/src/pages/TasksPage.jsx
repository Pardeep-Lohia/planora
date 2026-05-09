import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { tasksApi } from '../api/tasksApi.js';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning'];

function PriorityChip({ p }) {
  const bg =
    p === 'High'
      ? 'rgba(239,68,68,.12)'
      : p === 'Medium'
        ? 'rgba(245,158,11,.12)'
        : 'rgba(34,197,94,.12)';
  const color =
    p === 'High' ? 'rgba(239,68,68,.95)' : p === 'Medium' ? 'rgba(245,158,11,.95)' : 'rgba(34,197,94,.95)';

  return (
    <span
      className="badge"
      style={{
        background: bg,
        borderColor: 'rgba(59,130,246,.20)',
        color,
        fontWeight: 850
      }}
    >
      {p}
    </span>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newCategory, setNewCategory] = useState('Work');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    // Server already filters by status; we keep UI-level filters for priority/category.
    return tasks.filter((t) => {
      const pOk = priorityFilter === 'All' ? true : t.priority === priorityFilter;
      const cOk = categoryFilter === 'All' ? true : t.category === categoryFilter;
      return pOk && cOk;
    });
  }, [tasks, priorityFilter, categoryFilter]);

  const completedCount = tasks.filter((t) => t.done).length;
  const pendingCount = tasks.length - completedCount;

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const priority = priorityFilter === 'All' ? undefined : priorityFilter;
      const category = categoryFilter === 'All' ? undefined : categoryFilter;

      // Backend endpoint supports priority/category filters via query.
      const res = await tasksApi.list({
        priority,
        category
      });

      const mapped = (res?.data?.tasks || []).map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        category: t.category,
        done: Boolean(t.completed)
      }));

      setTasks(mapped);
    } catch (e) {
      setError(e?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priorityFilter, categoryFilter]);

  const toggleDone = async (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    try {
      await tasksApi.toggle(id);
      // refresh to ensure truth
      await loadTasks();
    } catch (e) {
      await loadTasks();
      setError(e?.message || 'Failed to update task');
    }
  };

  const addTask = async () => {
    const title = newTitle.trim();
    if (!title) return;
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await tasksApi.create({
        title,
        description: '',
        priority: newPriority,
        category: newCategory,
        dueDate: null,
        completed: false
      });
      setNewTitle('');
      setNewPriority('Medium');
      setNewCategory('Work');
      await loadTasks();
    } catch (e) {
      setError(e?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 950, fontSize: 28, letterSpacing: '-.4px' }}>Tasks</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Card-based task manager with clean filters.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="badge" style={{ background: 'rgba(34,197,94,.10)', borderColor: 'rgba(34,197,94,.25)', color: 'rgba(34,197,94,.95)' }}>
            Completed: {completedCount}
          </div>
          <div className="badge" style={{ background: 'rgba(245,158,11,.10)', borderColor: 'rgba(245,158,11,.25)', color: 'rgba(245,158,11,.95)' }}>
            Pending: {pendingCount}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Filters</div>
          <div className="muted" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
            Narrow down by priority and category.
          </div>

          <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
            <label>
              <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Priority</div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input"
                style={{ appearance: 'none' }}
              >
                <option value="All">All</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Category</div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input"
                style={{ appearance: 'none' }}
              >
                <option value="All">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
              <Button
                variant="ghost"
                onClick={() => {
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                }}
                style={{ padding: '10px 12px' }}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Add task</div>
          <div className="muted" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
            Keep it small. Keep it moving.
          </div>

          <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
            <div>
              <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Title</div>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Draft meeting agenda"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label>
                <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Priority</div>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="input"
                  style={{ appearance: 'none' }}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <div className="muted" style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Category</div>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input"
                  style={{ appearance: 'none' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Button variant="primary" onClick={addTask} style={{ width: '100%', padding: '12px 14px' }}>
              Add Task
            </Button>
          </div>
        </Card>
      </div>

      <Card style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900 }}>Task list</div>
            <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
              {filtered.length} item(s) match your filters.
            </div>
          </div>
          <div className="badge">Toggle status</div>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          {loading ? (
            <div className="muted" style={{ padding: 16, textAlign: 'center' }}>
              Loading tasks9797979...
            </div>
          ) : error ? (
            <div
              className="badge"
              style={{
                background: 'rgba(239,68,68,.10)',
                borderColor: 'rgba(239,68,68,.30)',
                color: 'rgba(239,68,68,.95)',
                padding: 14,
                borderRadius: 14,
                textAlign: 'center'
              }}
              role="alert"
            >
              {error}
            </div>
          ) : filtered.length ? (
            filtered.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr .6fr .7fr .8fr',
                  gap: 12,
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,.25)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      fontWeight: 900,
                      textDecoration: t.done ? 'line-through' : 'none',
                      color: t.done ? 'var(--muted)' : 'var(--text)'
                    }}
                  >
                    {t.title}
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>{t.category}</div>
                </div>

                <div>
                  <PriorityChip p={t.priority} />
                </div>

                <div className="badge" style={{ background: 'rgba(59,130,246,.08)' }}>
                  {t.category}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleDone(t.id)}
                      style={{ width: 18, height: 18 }}
                      aria-label={`Mark task ${t.title} as ${t.done ? 'pending' : 'completed'}`}
                      disabled={loading}
                    />
                    <span className="muted" style={{ fontWeight: 850, fontSize: 13 }}>
                      {t.done ? 'Completed' : 'Pending'}
                    </span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="muted" style={{ padding: 16, textAlign: 'center' }}>
              No tasks found. Adjust your filters or add a new task.
            </div>
          )}
        </div>
      </Card>

      <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 40 }}>
        <Button
          variant="primary"
          onClick={() => {
            // focus title input by scrolling to top (simple)
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              const el = document.querySelector('input[placeholder^="e.g."]');
              el?.focus?.();
            }, 350);
          }}
          style={{ padding: '12px 14px', borderRadius: 999 }}
          aria-label="Add task"
        >
          Add
        </Button>
      </div>

      <style>{`
        @media (max-width: 980px){
          div[style*="gridTemplateColumns: '1.2fr .6fr .7fr .8fr'"]{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px){
          div[style*="gridTemplateColumns: '1.2fr .6fr .7fr .8fr'"]{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

