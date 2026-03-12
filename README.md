# JobTrackr — Frontend

> A clean, modern job application tracking dashboard built with React. Track every application, visualize your pipeline, and auto-fill job data from any URL using AI.

🌐 **Live Demo:** [jobtrackr-sy.vercel.app](https://jobtrackr-sy.vercel.app)  
🔗 **Backend Repo:** [github.com/tywish-dev/jobtrackr](https://github.com/tywish-dev/jobtrackr)

---

## Features

- 🤖 **AI Auto-fill** — Paste a job posting URL and watch company, role, salary, and notes populate automatically
- 📊 **Stats Dashboard** — Visual pipeline breakdown with response rate and status distribution
- 🔍 **Filter & Search** — Filter by status (Applied, Interview, Offer, Rejected) and search by company or role
- 🔐 **JWT Auth** — Secure login and registration with token-based session management
- 📱 **Clean UI** — Editorial minimalist design with a forest green accent palette

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Charts | Recharts |
| Deployment | Vercel |

---

## Screenshots

### Dashboard Overview
> Stat cards, pipeline pie chart, and recent applications at a glance

### Applications Table
> Full list with status badges, salary range, applied date, and edit/delete actions

### AI Auto-fill
> Paste a job URL → click Auto-fill → form populates in seconds

### Stats View
> Response rate bar and breakdown by every status stage

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- JobTrackr API running (locally or on Render)

### Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/tywish-dev/jobtrackr-frontend.git
cd jobtrackr-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create environment file**

Create `.env.development` in the root:
```
REACT_APP_API_URL=http://localhost:8080
```

**4. Start**
```bash
npm start
```

App runs at `http://localhost:3000`

---

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Base URL of the JobTrackr backend API |

For production this points to the Render deployment:
```
REACT_APP_API_URL=https://jobtrackr-api-id0v.onrender.com
```

---

## Project Structure

```
src/
├── api/
│   └── axios.js              — Axios instance with JWT interceptor
├── components/
│   ├── Sidebar.jsx            — Navigation sidebar
│   ├── StatCard.jsx           — Metric display card
│   ├── StatusBadge.jsx        — Color-coded status pill
│   └── ApplicationModal.jsx   — Add/edit form with AI auto-fill
├── context/
│   └── AuthContext.jsx        — JWT auth state and login/logout
└── pages/
    ├── Login.jsx              — Split-panel login page
    ├── Register.jsx           — Registration with password strength
    └── Dashboard.jsx          — Main dashboard with all views
```

---

## How AI Auto-fill Works

1. Open the **Add Application** modal
2. Paste any job posting URL into the Job URL field
3. Click **✦ Auto-fill**
4. The backend fetches the page, extracts structured data using LLaMA 3.1, and returns:
   - Company name
   - Job title
   - Salary range
   - Role summary
5. Fields populate instantly — just review and save

Works best with Greenhouse, Lever, Workday, and direct company career pages.

---

## Deployment

This app is deployed on **Vercel** with automatic deployments on every push to `main`.

To deploy your own instance:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add `REACT_APP_API_URL` as an environment variable in your Vercel project settings.

---

## Author

**Samet Yılmaz** — Software Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/samet-yilmaz-dev)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/tywish-dev)

---

## License

MIT