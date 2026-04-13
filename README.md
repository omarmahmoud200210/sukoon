# Sukoon 🕊️

### Let me introduce to you Sukoon :)
**Sukoon** (meaning *calmness* or *serenity* in Arabic) is a productivity application designed for personal use and I built the features that currently need also it was a great experience to build it becasue I learnt a lot by doing.

---

## ✨ Key Features

### 📅 Advanced Task Management
*   **Tasks Management**: Manage Tasks, subtasks, lists, tags, priorities, due dates, reminders, and more.
*   **Pomodoro Timer**: Focus Timer with customizable work and break intervals.
*   **Tafreegh**: Brain Dump to offload overwhelming thoughts instantly and AI get Quran Aya to give to show it to you :).
*   **Prayer Timer**: Get prayer times based on your location.
*   **Message Today**: Get Quran Aya to give to show it to you :).
*   **Trash System**: Safely discard tasks and restore them if needed.

### ⏱️ Deep Focus Timer (Pomodoro)
*   Integrate focus sessions directly with your tasks.
*   Customizable work and break intervals.
*   Real-time tracking and focus history to monitor your peak productivity hours.

### 🧠 Tafreegh (Brain Dump)
*   **Mental Clarity**: A dedicated space to offload overwhelming thoughts instantly.
*   **Intelligent Organization**: Your thoughts are automatically analyzed and can be converted into actionable tasks.
*   **Spiritual Refresh**: Each "Tafreegh" session concludes with a calming Quranic verse tailored to provide reflection and peace.

### 🕌 Spiritual Integration
*   **Prayer Times**: Stay in sync with your day through highly accurate prayer schedules.
*   **Smart Notifications**: Receive gentle reminders for upcoming prayers and completed focus sessions.
*   **Personalized Aya**: A daily "Message Today" feature to keep you inspired by Quranic wisdom.

### 🛠️ Admin Portal
*   Comprehensive user management.
*   Role-based access control (Admin/User).
*   Platform activity monitoring and status management.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Modern, high-performance styling)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query v5](https://tanstack.com/query/latest)
- **Internationalization**: [i18next](https://www.i18next.com/) (Arabic/English support)

### Backend
- **Framework**: [Express 5](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Auth**: [Passport.js](https://www.passportjs.org/) (Google OAuth 2.0 & Local)
- **Validation**: [Zod](https://zod.dev/)
- **AI Integration**: [Groq](https://groq.com/) / [OpenAI](https://openai.com/) (Llama-3 models)
- **Monitoring**: [Sentry](https://sentry.io/) (Error tracking)
- **Logging**: [Winston](https://github.com/winstonjs/winston) + [Morgan](https://github.com/expressjs/morgan)

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- A [Google Cloud Console](https://console.cloud.google.com/) account (for OAuth)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/momentum.git
cd momentum
```

### 2. Backend Setup
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your details
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Copy .env.example to .env and fill in your details
npm run dev
```

### 📋 Environment Variables (Required Key Templates)

| Component | Key | Description |
| :--- | :--- | :--- |
| **Backend** | `DATABASE_URL` | PostgreSQL connection string |
| | `JWT_ACCESS_TOKEN` | Secret for access tokens |
| | `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| | `OPENAI_API_KEY` | Groq or OpenAI API key |
| **Frontend** | `VITE_API_URL` | URL of the backend server |
| | `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

---

## 📂 Project Structure

```text
Sukoon/
├── backend/            # Express server & Prisma schema
│   ├── prisma/         # Database migrations & schemas
│   ├── src/
│   │   ├── modules/    # Modular business logic (Task, Auth, Aya, etc.)
│   │   └── shared/     # Utilities, middlewares & types
├── frontend/           # Vite + React application
│   ├── src/
│   │   ├── components/ # Reusable UI components (Shadcn)
│   │   ├── hooks/      # Custom React hooks & Query hooks
│   │   ├── pages/      # View components
│   │   └── store/      # Zustand state management
└── package.json        # Workspace configuration
```

---

## Deployed 

https://sukoon-app.vercel.app/

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Made with peace. 🕊️**
