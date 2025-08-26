# 📋 Todo-IA - Smart Task List

A modern task management application built with Next.js 15, Supabase and TypeScript. Elegant interface, secure authentication and complete CRUD operations with automatic AI enhancement.

## 🚀 Overview

**Todo-IA** is a full-stack web application for personal task management that offers:

- ✅ **Complete authentication system** with Supabase Auth
- ✅ **Full CRUD operations** for tasks with Server Actions
- ✅ **Modern and responsive interface** with Tailwind CSS 4
- ✅ **Advanced security** with Row Level Security (RLS)
- ✅ **Optimized performance** with Next.js 15 and App Router
- ✅ **Intuitive user experience** with loading states
- 🤖 **Automatic AI enhancement** using OpenAI GPT-4o-mini
- 💬 **Smart chat** with integrated virtual assistant
- 📱 **Responsive design** mobile-first with Tailwind CSS 4
- 📝 **Markdown support** with React Markdown and remark-gfm
- 🌐 **Multi-language support** (English/Portuguese) with language toggle

## 🛠️ Technology Stack

### **Frontend**

- **[Next.js 15.5.0](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://react.dev/)** - User interface library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Static typing
- **[Tailwind CSS 4.1.12](https://tailwindcss.com/)** - Modern styling framework
- **[@tailwindcss/typography](https://github.com/tailwindcss/typography)** - Typography plugin

### **Backend & Database**

- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
- **PostgreSQL** - Relational database
- **Supabase Auth** - Authentication system
- **Row Level Security (RLS)** - Row-level security

### **Artificial Intelligence**

- **[OpenAI API](https://openai.com/)** - GPT-4o-mini for automatic enhancement
- **Server Actions** - Asynchronous server processing
- **Prompt Engineering** - Optimized system for generating useful descriptions

### **Development Tools**

- **ESLint 9** - Code quality linter
- **PostCSS** - CSS processor with Tailwind CSS 4
- **React Markdown** - Markdown content rendering
- **remark-gfm** - GitHub Flavored Markdown support

## 📁 Project Structure

```
todo-ia/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── action.ts          # Server Actions for CRUD and AI
│   │   │   ├── layout.tsx         # Dashboard layout
│   │   │   └── page.tsx           # Main dashboard page
│   │   ├── chat/
│   │   │   ├── action.ts          # Server Actions for AI chat
│   │   │   ├── layout.tsx         # Chat page layout
│   │   │   └── page.tsx           # Smart chat page
│   │   ├── login/
│   │   │   ├── action.ts          # Authentication Server Action
│   │   │   ├── layout.tsx         # Login page layout
│   │   │   └── page.tsx           # Login page
│   │   ├── layout.tsx             # Root application layout
│   │   ├── page.tsx               # Landing/home page
│   │   ├── globals.css            # Global styles with Tailwind CSS 4
│   │   └── favicon.ico            # Application icon
│   ├── components/
│   │   ├── ChatWidget.tsx         # Floating chat widget
│   │   ├── ChatStats.tsx          # Chat statistics component
│   │   ├── N8NStatus.tsx          # N8N status component
│   │   └── LanguageToggle.tsx     # Language switcher component
│   ├── contexts/
│   │   └── LanguageContext.tsx    # Internationalization context
│   ├── hooks/
│   │   ├── useChatHistory.ts      # Chat history hook
│   │   └── useIsClient.ts         # Client-side detection hook
│   ├── services/
│   │   └── n8n-chat.ts           # N8N chat service
│   ├── types/
│   │   └── chat.ts               # Chat type definitions
│   ├── utils/
│   │   ├── chat-history.ts       # Chat history utilities
│   │   └── supabase/
│   │       ├── client.ts         # Supabase client (browser)
│   │       ├── server.ts         # Supabase client (server)
│   │       └── middleware.ts     # Authentication middleware
│   └── middleware.ts             # Global Next.js middleware
├── public/                       # Static files
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS configuration with Tailwind
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
└── README.md                     # Project documentation
```

## 🎯 Features

### **🌐 Multi-language Support**

- **Language Toggle**: Button to switch between English and Portuguese
- **Default Language**: English (can be changed by user preference)
- **Persistent Selection**: Language preference saved in localStorage
- **Complete Translation**: All UI elements, messages, and placeholders
- **Responsive Design**: Language toggle integrated into all pages

### **🔐 Authentication**

- Secure login with email and password via Supabase Auth
- Persistent sessions with httpOnly cookies
- Automatic redirection based on authentication state
- Route protection middleware

### **📝 Task Management**

- **Create**: Add new tasks with title and description
- **View**: Organized list with filters (all, pending, completed)
- **Edit**: Modify existing tasks inline
- **Delete**: Remove tasks with confirmation
- **Toggle Status**: Mark as completed/pending
- **Expand**: View full or truncated descriptions

### **🤖 AI Enhancement**

- **Improvement Button**: "🤖 Improve with AI" button in forms
- **Smart Description**: AI analyzes title and description to create improved version
- **Manual Control**: User decides when to use AI
- **Visual Feedback**: Loading states during processing
- **Preview**: User sees generated description before saving
- **Markdown Support**: Generated descriptions include rich formatting

### **💬 Smart Chat**

- **Virtual Assistant**: Complete chat with AI for application questions
- **Smart Context**: AI understands conversation history
- **Personalized Responses**: Detailed explanations about features
- **Floating Widget**: Quick chat available on all pages
- **Smart Fallback**: Works even without AI configured
- **WhatsApp Interface**: Familiar and intuitive design

### **📊 Smart Dashboard**

- Real-time statistics
- Visual filters by status
- Responsive interface (mobile-first)
- Loading states and visual feedback
- Modern design with micro-interactions
- Markdown support in descriptions

### **🔒 Security**

- Row Level Security (RLS) in Supabase
- Authentication verification in all operations
- CSRF protection with Server Actions
- Server-side data validation

## ⚙️ Environment Setup

### **Prerequisites**

- Node.js 18+
- npm, yarn, pnpm or bun
- Supabase account
- OpenAI API key (for AI functionality)

### **1. Clone the repository**

```bash
git clone <repository-url>
cd todo-ia
```

### **2. Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### **3. Configure environment variables**

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-key

# OpenAI (for AI enhancement)
OPENAI_API_KEY=your-openai-key
```

> **Note**: AI functionality is optional. If the OpenAI key is not configured, the system will work normally without automatic enhancement.

### **4. Configure Supabase database**

Run the following SQL in the Supabase SQL editor:

```sql
-- Create todos table
CREATE TABLE todos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can manage their own tasks"
ON todos
FOR ALL
USING (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_inserted_at ON todos(inserted_at DESC);
```

### **5. Run the project**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 How to Use

### **1. Language Selection**

- Use the language toggle button (🇺🇸 EN / 🇧🇷 PT) in the top navigation
- Available on all pages: home, login, dashboard, and chat
- Preference is automatically saved
- Interface updates immediately

### **2. Access**

- Access the application at `http://localhost:3000`
- Default language is English
- Login with your credentials
- You'll be redirected to the dashboard

### **3. Task Management**

- **Create**:
  1. Fill in the task title
  2. Optionally, enter an initial description
  3. Click "🤖 Improve with AI" to enhance the description
  4. Review the generated description
  5. Click "Add Task" to save
- **Filter**: Use "All", "Pending", "Completed" buttons
- **Edit**:
  1. Click the ✏️ icon on the task
  2. Modify title or description
  3. Use "🤖 Improve with AI" to enhance
  4. Click "💾 Save" to confirm
- **Complete**: Click the circle next to the task
- **Delete**: Click the 🗑️ icon (with confirmation)
- **Expand**: Click to see full description

### **4. AI Enhancement**

- **Manual Activation**: Click the "🤖 Improve with AI" button
- **Available in**: Creation form and edit mode
- **Process**:
  1. AI analyzes current title and description
  2. Generates improved and more detailed version
  3. User reviews before saving
- **Requirements**: Title required to use AI
- **Format**: Generated descriptions include Markdown for better organization

### **5. Smart Chat**

- **Complete Chat**: Access `/chat` for full AI conversation
- **Floating Widget**: Floating button in dashboard for quick chat
- **Smart Context**: AI remembers conversation history
- **Personalized Responses**: Explanations about application features
- **Smart Fallback**: Works even without AI configured

### **6. Dashboard**

- View real-time statistics
- Track task progress
- Interface optimized for productivity
- AI-enriched descriptions for better context
- Complete Markdown support in descriptions

## 🤖 AI Enhancement Examples

### **User Input:**

```
Title: "Study React"
Current Description: "Review basic concepts"
```

### **After clicking "🤖 Improve with AI" (with Markdown support):**

```markdown
## Objective

Deepen knowledge in **React** for modern web development, starting from reviewing fundamental concepts.

### Structured study plan:

#### 1. Basic Concepts (Review)

- Functional and class components
- Props and PropTypes
- Basic state management
- Event handling

#### 2. Essential Hooks

- `useState` for state management
- `useEffect` for side effects
- `useContext` for data sharing
- Custom hooks for reusable logic

#### 3. Applied Practice

1. Create a simple todo-list project
2. Implement CRUD operations
3. Add form validation

> **Tip**: Practice coding along with tutorials to better retain learning.

**Recommended Resources:**

- [Official React Documentation](https://react.dev)
- React Developer Tools
- Practical projects on CodeSandbox

**Estimated Time:** 2-3 weeks (1-2h/day)
```

### **Supported Markdown Features:**

- ✅ **Headers** (`#`, `##`, `###`)
- ✅ **Bold text** (`**text**`)
- ✅ **Italic text** (`*text*`)
- ✅ **Ordered lists** (`1. item`)
- ✅ **Unordered lists** (`- item`)
- ✅ **Inline code** (`code`)
- ✅ **Code blocks** (`code`)
- ✅ **Quotes** (`> text`)
- ✅ **Links** (`[text](url)`)
- ✅ **Tables** (GitHub Flavored Markdown)

## 📝 Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Run production build
npm run start

# Check code quality
npm run lint
```

## 🌐 Deployment

### **Vercel (Recommended)**

1. Connect your repository on [Vercel](https://vercel.com)
2. Configure environment variables
3. Automatic deployment on each commit

### **Other Platforms**

- Netlify
- Railway
- Render
- AWS Amplify

## 🔧 Troubleshooting

### **Problem: AI not working**

1. **Check API key:**

   ```bash
   # In .env.local file
   OPENAI_API_KEY=sk-proj-...
   ```

2. **Check server logs:**

   - Open development terminal
   - Look for OpenAI-related errors

3. **Test connectivity:**
   - Check if key has available credits
   - Confirm key has permissions for GPT-4o-mini model

### **Problem: Descriptions not appearing**

- AI processes in background, wait a few seconds
- Reload page if necessary
- Check browser console for errors

### **Fallback without AI**

If AI is not available:

- Use toggle to disable
- System will work normally without enhancement
- Manual descriptions continue working

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📋 Database Structure

### **Table: todos**

| Field         | Type      | Description                        |
| ------------- | --------- | ---------------------------------- |
| `id`          | BIGINT    | Primary key (auto-increment)       |
| `user_id`     | UUID      | Reference to authenticated user    |
| `task`        | TEXT      | Task title (required)              |
| `description` | TEXT      | Optional task description          |
| `is_complete` | BOOLEAN   | Completion status (default: false) |
| `inserted_at` | TIMESTAMP | Creation date/time                 |

## 🔧 Architecture

### **Internationalization**

- **React Context**: `LanguageContext` for global state management
- **Local Storage**: Persistent language preference storage
- **Translation Object**: Complete translations for EN/PT
- **Component Integration**: `LanguageToggle` component in all layouts
- **Default Language**: English (as requested)

### **Server Actions**

- All CRUD operations execute on server
- Optimized security and performance
- Automatic cache revalidation
- Asynchronous AI processing in background

### **Authentication Middleware**

- Sensitive route protection
- Session management
- Smart redirection

### **Reusable Components**

- Modular and scalable interface
- TypeScript for safe typing
- Tailwind CSS 4 for consistent styling
- Smart AI integration

### **Artificial Intelligence**

- **OpenAI GPT-4o-mini**: Model optimized for speed and cost
- **Prompt Engineering**: Optimized system for generating useful descriptions
- **Asynchronous Processing**: Doesn't block user interface
- **Graceful Fallback**: System works even without AI configured
- **Markdown Support**: Generated descriptions include rich formatting
- **Smart Chat**: Virtual assistant with conversation context
- **Contextual Responses**: AI understands conversation history

### **Tailwind CSS 4**

- **Modern Configuration**: Using PostCSS and native configuration
- **Typography Plugin**: Advanced typography support
- **Design System**: Consistent and responsive components
- **Mobile-First**: Interface optimized for mobile devices

## 📞 Support

For questions, problems or suggestions:

- Open an issue in the repository
- Contact the development team

---

**Developed by David Brigido**
