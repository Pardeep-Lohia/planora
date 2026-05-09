import React, { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { remindersApi } from '../api/remindersApi.js';
import { tasksApi } from '../api/tasksApi.js';

export default function NotificationsPage() {
  const [reminders, setReminders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const load = async () => {
    const [remRes, taskRes] = await Promise.all([remindersApi.list(), tasksApi.list({ status: 'pending' })]);
    setReminders(remRes?.data?.reminders || []);
    setTasks(taskRes?.data?.tasks || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      reminders.forEach((r) => {
        const at = r.remindAt?.seconds ? r.remindAt.seconds * 1000 : new Date(r.remindAt).getTime();
        if (at && Math.abs(now - at) < 30000) toast(r.title);
      });
    }, 30000);
    return () => window.clearInterval(id);
  }, [reminders]);

  const overdue = useMemo(() => tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = t.dueDate.seconds ? new Date(t.dueDate.seconds * 1000) : new Date(t.dueDate);
    return d < new Date();
  }), [tasks]);

  const add = async () => {
    if (!title.trim() || !remindAt) return;
    await remindersApi.create({ title: title.trim(), remindAt: new Date(remindAt).toISOString() });
    setTitle('');
    setRemindAt('');
    await load();
  };

  const remove = async (id) => {
    await remindersApi.remove(id);
    await load();
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <Toaster />
      <div>
        <div style={{ fontWeight: 950, fontSize: 28 }}>Notifications</div>
        <div className="muted" style={{ marginTop: 6 }}>Reminders, alerts, and overdue tasks.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
          <div style={{ fontWeight: 900 }}>Create reminder</div>
          <Input placeholder="Reminder title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input type="datetime-local" value={remindAt} onChange={(e) => setRemindAt(e.target.value)} />
          <Button variant="primary" onClick={add}>Add reminder</Button>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Overdue</div>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            {overdue.length ? overdue.map((t) => <div key={t.id} className="badge">{t.title}</div>) : <div className="muted">No overdue tasks.</div>}
          </div>
        </Card>
      </div>
      <Card style={{ padding: 18 }}>
        <div style={{ fontWeight: 900 }}>Scheduled alerts</div>
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {reminders.map((r) => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <span>{r.title}</span>
              <Button variant="ghost" onClick={() => remove(r.id)}>Delete</Button>
            </div>
          ))}
          {!reminders.length ? <div className="muted">No reminders yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}
