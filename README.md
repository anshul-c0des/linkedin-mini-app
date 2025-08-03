# LinkedIn Mini

A mini LinkedIn-like platform built with **Next.js**, **Clerk** for authentication, **Tailwind CSS** for styling, and **MongoDB** for data storage.

It features user authentication, posting, community feeds, profile pages, toasts, and a responsive UI inspired by LinkedIn.

---

## 🚀 Tech Stack

- **Next.js** (App Router, React 18+)
- **Clerk** (User Authentication)
- **MongoDB** (Database)
- **Tailwind CSS** (Utility-first CSS framework)
- **Axios** (API requests)
- **React Hot Toast** (Notifications)
- **date-fns** (Date & time formatting with Indian Standard Time support)
- **Vercel** (Deployment)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Clerk](https://clerk.dev) account (for authentication keys)

---

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/linkedin-mini.git
cd linkedin-mini
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Setup environment variables:**

```bash
Create a .env.local file at the root with your Clerk credentials:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_uri
```

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

---

### Demo / Admin User Logins

- This app uses Clerk for authentication.
- No predefined demo or admin users are included.
- Simply sign up through the app to create your account.
- (If needed, a development account can be shared, but the name will appear as “user” only.)

---

### Features

- ✅ Responsive design with mobile-first navbar (hamburger menu)
- ✅ Feed with post creation and real-time loading spinners
- ✅ Profile pages with editable bio
- ✅ Accurate timestamps (relative & formatted)
- ✅ Toast notifications for success & errors

---

## 🔗 Live Demo

[Click here to view the deployed app](https://linkedin-mini-e85t0x4t3-anshuls-projects-ad041669.vercel.app/)

You can sign up or sign in with your email to explore the platform.

---