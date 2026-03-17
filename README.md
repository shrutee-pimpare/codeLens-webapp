# 🔍 CodeLens — AI Code Review Assistant

> A production-ready AI-powered code review tool built with React, TypeScript, Node.js, and OpenAI GPT-4o mini. Paste code or import from GitHub and receive structured feedback on bugs, performance, readability, complexity, and refactoring opportunities.

---

## 📸 Screenshots

```
┌─────────────────────────────────────────────────────────────────┐
│  CodeLens [AI]   Code Review — Powered by OpenAI GPT-4o mini   │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐                     │
│  │  Code Editor          [TS▾] [GitHub] [🗑]│                     │
│  │  ─────────────────────────────────────  │                     │
│  │  function bubbleSort(arr: number[]) {   │                     │
│  │    for (let i = 0; i < n - 1; i++) {   │                     │
│  │      for (let j = 0; j < ...) {        │                     │
│  │  ...                                   │                     │
│  │  ─────────────────────────────────────  │                     │
│  │  42 lines                [▶ Review Code]│                     │
│  └─────────────────────────────────────────┘                     │
│                                                                  │
│  ┌──────────── Score ──────────────────────────────────────┐    │
│  │  7/10 Good  · 8 total issues  · 2 bugs · 3 perf         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ [Bugs 2][Performance 3][Readability 1][Suggestions 2]   │    │
│  │ [Refactor]                                              │    │
│  │  • Potential null dereference on line 12                │    │
│  │  • Missing bounds check before array access             │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
ai-code-review/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor/      # VScode editor wrapper
│   │   │   ├── ReviewPanel/     # Tabbed results panel
│   │   │   ├── ComplexityChart/ # Recharts radial visualization
│   │   │   ├── FileUploader/    # GitHub URL importer
│   │   │   └── Loader/          # Animated loading state
│   │   ├── pages/
│   │   │   └── HomePage.tsx     # Main layout orchestrator
│   │   ├── services/
│   │   │   └── api.ts           # Axios API client
│   │   ├── hooks/
│   │   │   └── useReview.ts     # Review state + async logic
│   │   ├── types/
│   │   │   └── review.types.ts  # Shared TypeScript interfaces
│   │   ├── utils/
│   │   │   └── formatResponse.ts # Score/color helpers
│   │   └── styles/
│   │       └── globals.css      # Tailwind + custom CSS
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   │   └── reviewController.ts  # Request handlers
│   │   ├── routes/
│   │   │   └── reviewRoutes.ts      # Express router + validation
│   │   ├── services/
│   │   │   ├── openaiService.ts     # GPT-4o mini integration
│   │   │   └── complexityAnalyzer.ts # Heuristic complexity engine
│   │   ├── utils/
│   │   │   ├── githubFetcher.ts     # GitHub raw URL fetcher
│   │   │   └── logger.ts            # Winston logger
│   │   ├── middleware/
│   │   │   └── errorHandler.ts      # Centralized error handling
│   │   ├── config/
│   │   │   └── openai.ts            # OpenAI client config
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Entry point
│   └── tsconfig.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 9+
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### 1. Clone & Install

```bash
git clone https://github.com/shrutee-pimpare/codeLens-webapp.git
cd codeLens-webapp

# Install all dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=sk-your-key-here
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

### 3. Run in Development

```bash
# From root — starts both frontend and backend
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker

```bash
# Build and run with Docker Compose
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

docker-compose up --build
```

- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:3001](http://localhost:3001)

---

## 🔌 API Documentation

### `POST /api/review`

Analyze code with AI and heuristic complexity detection.

**Request:**

```json
{
  "code": "function bubbleSort(arr) { ... }",
  "language": "javascript"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bugs": ["Missing null check — arr could be undefined on line 1"],
    "performance": [
      "Bubble sort is O(n²); consider using Array.prototype.sort() for large inputs"
    ],
    "readability": ["Variable 'n' should be named 'length' for clarity"],
    "improvements": [
      "Add TypeScript type annotations for the parameter and return type"
    ],
    "refactor_example": "function bubbleSort(arr: number[]): number[] {\n  ...\n}",
    "overall_score": 6,
    "summary": "The code is functional but has readability and performance concerns...",
    "complexity": {
      "time": "O(n²)",
      "space": "O(1)",
      "cyclomatic": 5,
      "linesOfCode": 12,
      "details": "Nested loops detected — quadratic time complexity."
    },
    "language": "javascript",
    "analyzedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### `POST /api/fetch-github`

Fetch source code from a GitHub URL.

**Request:**

```json
{
  "url": "https://github.com/user/repo/blob/main/src/app.ts"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": "// file content...",
    "filename": "app.ts",
    "language": "typescript"
  }
}
```

---

### `GET /health`

Health check endpoint.

```json
{ "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z" }
```

---

## ⚙️ Environment Variables

| Variable               | Default                 | Description                       |
| ---------------------- | ----------------------- | --------------------------------- |
| `OPENAI_API_KEY`       | —                       | **Required.** Your OpenAI API key |
| `PORT`                 | `3001`                  | Backend server port               |
| `NODE_ENV`             | `development`           | Environment mode                  |
| `RATE_LIMIT_WINDOW_MS` | `900000`                | Rate limit window (15 min)        |
| `RATE_LIMIT_MAX`       | `100`                   | Max requests per window           |
| `VITE_API_URL`         | `http://localhost:3001` | Backend URL for frontend          |

---

## 🧠 Supported Languages

| Language   | VScode Highlight | AI Review | Complexity |
| ---------- | ---------------- | --------- | ---------- |
| TypeScript | ✅               | ✅        | ✅         |
| JavaScript | ✅               | ✅        | ✅         |
| Python     | ✅               | ✅        | ✅         |
| Java       | ✅               | ✅        | ✅         |
| C++        | ✅               | ✅        | ✅         |
| C          | ✅               | ✅        | ✅         |
| C#         | ✅               | ✅        | ✅         |
| Go         | ✅               | ✅        | ✅         |
| Rust       | ✅               | ✅        | ✅         |
| Ruby       | ✅               | ✅        | ✅         |
| PHP        | ✅               | ✅        | ✅         |
| Swift      | ✅               | ✅        | ✅         |
| Kotlin     | ✅               | ✅        | ✅         |
| SQL        | ✅               | ✅        | ✅         |

---

## 🧩 Key Design Decisions

### Frontend

- **VScode Editor** — same engine as VS Code, with syntax highlighting, bracket matching, and ligature fonts
- **Recharts RadialBar** — visual complexity score at a glance
- **useReview hook** — clean separation of API logic from UI state
- **TypeScript strict mode** — full type safety across all components

### Backend

- **Heuristic complexity analyzer** — detects loop depth, recursion, sorting patterns, and DP before calling OpenAI, keeping latency low
- **Parallel execution** — AI review and complexity analysis run with `Promise.all`
- **express-validator** — request validation before any processing
- **express-rate-limit** — abuse protection out of the box
- **Winston** — structured, levelled logging with file rotation

---

## 🔮 Future Improvements

- [ ] **GitHub repository browser** — explore repo tree and pick files
- [ ] **Review history** — store past reviews with timestamps
- [ ] **Diff view** — side-by-side original vs refactored code
- [ ] **CI/CD integration** — GitHub Action to review PRs automatically
- [ ] **Custom rulesets** — configure which checks to enable/disable
- [ ] **Multi-file support** — review entire modules at once
- [ ] **Export as PDF** — shareable review reports
- [ ] **Auth + teams** — save reviews per user/org
- [ ] **Streaming** — stream OpenAI tokens for faster perceived response
- [ ] **Model selection** — switch between GPT-4o, GPT-4o-mini, Claude

---


## 🙏 Built With

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [VScode Editor](https://microsoft.github.io/monaco-editor/)
- [Tailwind CSS](https://tailwindcss.com)
- [Express](https://expressjs.com)
- [OpenAI Node SDK](https://github.com/openai/openai-node)
- [Recharts](https://recharts.org)
- [Winston](https://github.com/winstonjs/winston)
