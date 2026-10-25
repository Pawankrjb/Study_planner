# 🚀 ReachInbox Full-Stack Email Job Scheduler & Dashboard

A production-grade, distributed email scheduling service and real-time dashboard built for the **ReachInbox Hiring Assignment**.

---

## 🎯 System Architecture Overview

The system is designed for **extreme reliability**, **zero job loss across server restarts**, **strict provider throttling**, and **per-sender hourly rate limiting with live Slack notifications**.

```
[ Client Frontend (Vite / React 19 / Tailwind) ]
               │
               ▼ (REST APIs)
[ Express.js + TypeScript Backend (Port 4000) ]
   │                 │                   │
   ▼                 ▼                   ▼
[ Relational DB ]  [ Redis & BullMQ ]  [ Elasticsearch Service ]
(PostgreSQL /      (Delayed Sorted     (Full-Text Multi-Match Index)
 SQLite LibSQL)     Set Queues)
                     │
                     ▼
         [ BullMQ Workers (Parallel Concurrency) ]
           ├── 1. Atomic Redis Hourly Rate Limiter (per-sender)
           │      └── Limit Hit? ➡️ Defer to Next Hour + Live Slack Alert
           ├── 2. Provider Throttling Delay (min 2000ms)
           └── 3. Fake SMTP Dispatch via Ethereal Email
                  └── Generate 1-Click Browser Preview URL
```

---

## ✨ Features Checklist (Mapped to Requirements)

### 🖥️ Backend
- [x] **Core Scheduler (No Cron)**: BullMQ delayed jobs backed by Redis sorted sets (strictly no `node-cron` or OS crontabs).
- [x] **Relational DB Persistence**: Dual-engine persistence supporting PostgreSQL and SQLite/LibSQL with ACID guarantees.
- [x] **Restart & Crash Resilience**: 
  - Delayed jobs stay stored in Redis sorted sets across restarts.
  - On startup, a recovery sync queries the database and verifies that any pending emails are present in BullMQ without duplication (idempotency via unique `jobId`).
- [x] **Fake SMTP with Ethereal Email**: Automatically generates an Ethereal test account on the fly (or reads `.env`), delivers fake SMTP emails, and captures verified `previewUrl` links for every send.
- [x] **Elasticsearch Full-Text Search**: Indexed in Elasticsearch (`@elastic/elasticsearch`) across recipient, sender, subject, and body with intelligent fallback to SQL full-text search.
- [x] **Live BullMQ Dashboard**: Real-time queue monitor powered by `@bull-board/express` mounted at `/admin/queues`.
- [x] **Configurable Worker Concurrency**: BullMQ worker configured with `WORKER_CONCURRENCY=5` (safe under multi-worker load).
- [x] **Provider Throttling (Minimum Delay Between Sends)**: Configurable delay (`MIN_EMAIL_DELAY_MS=2000`, 2 seconds between individual sends) to mimic provider throttling.
- [x] **Hourly Rate Limiting (Redis-Backed Atomic Counters)**:
  - Enforced per-sender (`MAX_EMAILS_PER_HOUR=50`) using atomic Redis `INCR` + `EXPIRE` keyed by `ratelimit:{sender}:{hourWindow}`.
  - **Zero dropped jobs**: When limit is hit, jobs are rescheduled into the next available hour window preserving order.
- [x] **Live Slack Alerts on Rate Limit Hit**: Sends a rich Slack notification the moment a sender exceeds their hourly limit; handles disconnect/reconnect gracefully.

### 🎨 Frontend
- [x] **Aesthetic Integrity**: Retains clean modern dark-mode aesthetic (`#1e1c1c`, white cards, glowing gradients, smooth micro-animations).
- [x] **Google OAuth Login**: Sign in with Google (Avatar, Name, Email displayed in top header with Logout).
- [x] **Main Dashboard**: Real-time stats (Queued/Delayed, Delivered, Rate Limits, Worker Concurrency).
- [x] **Compose New Email Modal**:
  - Sender dropdown (multi-sender support)
  - Subject & Body inputs
  - **CSV / TXT Lead File Upload** with automatic regex extraction and lead count badge (`✓ X leads detected`)
  - **Quick Test Presets** (+5, +25, +100 leads) for instant demoing
  - Start time picker (Immediate / Schedule For Later)
  - Custom delay and hourly limit inputs
- [x] **Scheduled Emails Table**: Recipient, Sender, Subject, Scheduled Time, Delay, Limit, Status badges, and Cancel action. Includes skeleton loading and empty states.
- [x] **Sent Emails Table**: Recipient, Sender, Subject, Delivered Timestamp, Sent/Failed status, and 1-click **"View in Ethereal"** preview button.
- [x] **Elasticsearch Live Search**: Instant multi-field search across recipient, sender, subject, and body.
- [x] **Slack Integration Modal**: Connect via Incoming Webhook URL or OAuth with a live **"Send Test Alert"** button.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v25)
- **Redis**: Running locally on port `6379` (or via Docker)

---

### Step 1: Start Redis (Docker)
```bash
docker run -d --name reachinbox-redis -p 6379:6379 redis:alpine
```
*(Or run `docker compose up -d` to launch Redis, PostgreSQL, and Elasticsearch together)*

---

### Step 2: Install & Start Backend
```bash
cd backend
npm install
npm run dev
```
> The backend boots on **`http://localhost:4000`**.
> Live BullMQ Board is available at **`http://localhost:4000/admin/queues`**.

---

### Step 3: Install & Start Frontend
In a new terminal window:
```bash
# In the root project folder
npm install
npm run dev
```
> The frontend runs on **`http://localhost:5173`**.

---

## ⚙️ Environment Variables (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Backend API port |
| `REDIS_HOST` | `127.0.0.1` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string (falls back to LibSQL/SQLite automatically) |
| `ELASTICSEARCH_URL` | `http://localhost:9200` | Elasticsearch node URL |
| `WORKER_CONCURRENCY` | `5` | BullMQ worker concurrency |
| `MIN_EMAIL_DELAY_MS` | `2000` | Throttling delay between sends (min 2 seconds) |
| `MAX_EMAILS_PER_HOUR` | `50` | Hourly rate limit per sender |
| `SLACK_WEBHOOK_URL` | `""` | Optional initial Slack Incoming Webhook |
| `ETHEREAL_USER` | `""` | Optional; auto-creates test account if empty |
| `ETHEREAL_PASS` | `""` | Optional Ethereal password |

---

## 🛡️ Implementation Details & Trade-offs

### 1. How Scheduling Works (No Cron)
BullMQ utilizes Redis sorted sets (`ZSET`) where the score represents the Unix timestamp when the job is eligible to run. Workers query the delayed sorted set using atomic Redis commands. No polling cron scripts (`cron`, `node-cron`, `agenda`) are used.

### 2. Server Restart Persistence
- **Job Idempotency**: Each email inserted into the database is assigned a unique UUID. When added to BullMQ, `jobId: email.id` is explicitly set. BullMQ rejects duplicate job IDs.
- **Cold Boot Recovery**: If the server crashes or restarts, BullMQ reads pending delayed jobs directly from Redis. Furthermore, `recoverScheduledJobsOnStartup()` verifies the relational database and re-queues any unqueued jobs.

### 3. Rate Limiting & Next-Window Deferral
- Rate limits are stored in Redis under `ratelimit:{sender}:{YYYY-MM-DDTHH}`.
- When `currentCount > limit`, the worker:
  1. Reverts the counter decrement.
  2. Calculates `delayUntilNextWindowMs = (nextHourStart - now) + 1000`.
  3. Updates database status to `delayed_rate_limited`.
  4. Dispatches a live alert to Slack.
  5. Re-queues the job with the calculated delay to be executed in the next hour window, preserving ordering.

### 4. Fake SMTP & Ethereal Previews
For every email processed, `nodemailer` transmits the payload to `smtp.ethereal.email` and invokes `nodemailer.getTestMessageUrl(info)`. The resulting URL is stored in the database and displayed in the frontend as a clickable "View in Ethereal" link.

---

## 📹 Video Demo Guide (Max 5 Minutes)

1. **Google Login / Dashboard Tour (1 min)**:
   - Click "Sign in with Google" or login.
   - Show user avatar, email, and name in the top navigation.
   - Tour the metrics cards and the "Email Job Scheduler & Dispatcher" dashboard.
2. **Scheduling & Throttling (1.5 min)**:
   - Click "+ Compose New Email".
   - Use "+5 Leads" preset or upload a CSV file (show "5 leads detected").
   - Set delay to 2 seconds and click "Schedule".
   - Show jobs in **Scheduled Emails** table, then watch them transition into **Sent Emails** with Ethereal preview links.
   - Click "View in Ethereal" to inspect the rendered email in your browser!
3. **Server Restart Persistence (1 min)**:
   - Schedule an email with a 30-second delay.
   - Stop the backend process in the terminal (`Ctrl + C`).
   - Restart the backend (`npm run dev`).
   - Notice the log: `Recovered persistent scheduled email...`
   - Observe the job execute at its intended time.
4. **Rate Limiting & Live Slack Alert (1 min)**:
   - Click "Connect Slack" and enter your webhook (or click "Send Live Test Alert").
   - Schedule 4 emails with Hourly Limit set to `2`.
   - Watch the first 2 succeed and the remaining 2 update to `Rate-Limited (Rescheduled)`.
   - Show the live alert delivered to your Slack channel!
5. **Elasticsearch & Bull-board (30s)**:
   - Search for a keyword in the search bar.
   - Click "BullMQ Live Board" to display active/delayed/completed queues in `/admin/queues`.

---

## 👥 Submission Contact
- Prepared for: **Mitrajit & Yadav036**
- Organization: **ReachInbox.ai (Outbox Labs)**
# emailsheduler
