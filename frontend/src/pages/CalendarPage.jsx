import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { tasksApi } from '../api/tasksApi.js';

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('month');
  const today = new Date();

  useEffect(() => {
    tasksApi.list({}).then((res) => setTasks(res?.data?.tasks || [])).catch(() => setTasks([]));
  }, []);

  const days = useMemo(() => {
    const count = view === 'week' ? 7 : new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const start = view === 'week' ? new Date(today) : new Date(today.getFullYear(), today.getMonth(), 1);
    return Array.from({ length: count }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const tasksForDay = (day) => tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = t.dueDate.seconds ? new Date(t.dueDate.seconds * 1000) : new Date(t.dueDate);
    return d.toDateString() === day.toDateString();
  });

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>Calendar</div>
          <div className="muted" style={{ marginTop: 6 }}>Scheduled tasks by date.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btnGhost" onClick={() => setView('week')}>Week</button>
          <button className="btn btnGhost" onClick={() => setView('month')}>Month</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: view === 'week' ? 'repeat(7, 1fr)' : 'repeat(7, 1fr)', gap: 10 }}>
        {days.map((day) => (
          <Card key={day.toISOString()} style={{ padding: 12, minHeight: 130 }}>
            <div style={{ fontWeight: 900 }}>{day.getDate()}</div>
            <div className="muted" style={{ fontSize: 12 }}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
              {tasksForDay(day).map((task) => <div key={task.id} className="badge" style={{ justifyContent: 'flex-start' }}>{task.title}</div>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
