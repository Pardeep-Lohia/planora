# TODO - Planora feature completion

## Step 1 - Validate current app wiring
- [x] Inspect Sidebar/Topbar/navigation to see what routes exist and where to add Calendar/Admin/Notifications pages.
- [x] Inspect existing frontend components for toast/notifications/calendar/admin.
- [x] Inspect backend package.json/server setup to confirm runtime (Firestore + Firebase auth only).

## Step 2 - Implement AI Daily Planner -> Persisted tasks (Accept Plan)
- [x] Update backend: extend planner controller/service with an endpoint to accept a plan and create tasks in `tasks` collection.

- [x] Define mapping from AI timeline blocks to task fields (title/description/priority/category/dueDate).

- [x] Update frontend PlannerPage: call `plannerApi.generate`, render returned timeline, and provide an “Accept plan” button.
- [x] After accept: navigate to /app/dashboard or /app/tasks.


## Step 3 - Implement AI Chat Assistant (wire to backend + typing animation)
- [x] Update ChatPage to use `chatApi.sendMessage` and `chatApi.listConversations/history`.
- [x] Add typing animation while awaiting response.
- [x] Make chat context-aware by including accepted-plan tasks from DB (backend prompt enhancement).




## Step 4 - Task Manager completeness
- [ ] Update TasksPage to support create/update/delete and dueDate/description/status fields.
- [ ] Add status filter UI (pending/completed) and ensure server query matches.
- [ ] Add edit modal/form and delete confirmation.

## Step 5 - Dashboard analytics correctness
- [ ] Verify analytics response shape between backend and frontend DashboardPage/AnalyticsPage.
- [ ] Replace any mocked values in AnalyticsPage with real backend data.

## Step 6 - Notifications system
- [ ] Add Notifications UI page/section (or integrate into Dashboard/Topbar) showing upcoming reminders.
- [ ] Implement toast notifications on due reminders (client polling is acceptable).
- [ ] Optional: add backend scheduler later if needed.

## Step 7 - Calendar integration
- [ ] Add CalendarPage with monthly view.
- [ ] Map tasks by dueDate into calendar cells.
- [ ] Add route + sidebar entry.

## Step 8 - Admin panel (basic)
- [ ] Detect how users are authenticated (Firebase only). Add backend/admin auth guard using Firebase custom claims.
- [ ] Implement admin routes: list users + system stats.
- [ ] Add frontend AdminPage and route.

## Step 9 - Testing
- [ ] End-to-end test: Generate plan → Accept → tasks appear → dashboard and chat reference tasks.
- [ ] Test CRUD: tasks add/edit/delete and filters.
- [ ] Test reminders: reminders list + toast triggers.

