# N8N Workflows for Todo-IA

This folder contains the complete N8N workflow files for the Todo-IA WhatsApp integration.

## 📁 Files

### 🤖 todoai.json

**Main TodoAI Workflow**

- Complete WhatsApp integration via Evolution API
- AI-powered task management with OpenAI GPT-4o-mini
- Full CRUD operations with Supabase
- PostgreSQL memory for conversation context
- Automatic message reading and response

### 🔍 Search agent.json

**Search Agent Workflow**

- Internet search capabilities via Tavily API
- AI-powered result processing and formatting
- Designed to be called by the main TodoAI workflow
- Returns detailed, formatted search results

## 🚀 Quick Setup

1. **Download** the workflow files
2. **Import** into your N8N instance
3. **Configure credentials**:
   - Supabase API
   - OpenAI API
   - Evolution API (WhatsApp)
   - Tavily Search API
   - PostgreSQL (for memory)
4. **Activate** the workflows
5. **Test** with WhatsApp

## 🔗 Dependencies

- N8N instance (self-hosted or cloud)
- Supabase account and database
- OpenAI API key
- Evolution API or WhatsApp Business API
- Tavily Search API key
- PostgreSQL database for chat memory

## 📖 Documentation

For complete setup instructions, see the main README.md file in the project root.

---

**Note**: These workflows are specifically designed for the Todo-IA application and require the corresponding database schema and environment setup.
