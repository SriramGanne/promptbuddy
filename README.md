# PromptPilot 🚀
**Bridging the Gap Between Raw Intent and Production-Ready Prompts.**

PromptPilot is an advanced, research-grounded Prompt Engineering Agent. It eliminates the "trial-and-error" loop of working with LLMs by using an agentic reasoning workflow to transform vague thoughts into structured, high-performance instructions — delivered as a native **MCP server** that intercepts every prompt before Claude responds.

---

## 🎯 The Problem
Most users struggle with **Instruction Drift** and **Prompt Ambiguity**. While frontier models are powerful, they require specific structural markers (XML, CoT, delimiters) to perform consistently. PromptPilot acts as the "Navigator," translating simple language into the technical handshake LLMs require.

---

## ✨ Key Features

* **Prompt Interception (MCP):** Runs as an MCP server inside Claude Code. Every user message passes through PromptPilot before Claude acts on it — transparent and automatic.
* **Agentic Gap Analysis:** Identifies missing variables (Context, Persona, Format, Constraints) and asks targeted follow-up questions before synthesizing.
* **Knowledge Vault (RAG):** A curated library of 2026 prompt engineering research. Every prompt is grounded in techniques like *Chain-of-Thought*, *Chain-of-Density*, and *Self-Consistency*.
* **Semantic Cache:** Upstash Redis caches high-intent query patterns, reducing latency and API cost for repeated prompt shapes.
* **Model-Aware Optimization:** Tailors output structure for the target model — Claude, ChatGPT, Gemini, or Grok.
* **Power Mode:** Returns a transparent reasoning trace (`<thinking>` tags) showing how the AI interpreted the request.

---

## 🏗️ Technical Architecture

### The Intelligence Stack
* **Core Logic:** `google/gemma-3n-e4b-it` via Together AI (optimized for latency-to-logic efficiency)
* **Vector Database:** Supabase (`pgvector`) storing 1024-dimension embeddings
* **Embedding Model:** `intfloat/multilingual-e5-large-instruct` with `passage:`/`query:` instruction prefixes
* **Semantic Cache:** Upstash Redis to reduce COGS and latency for redundant high-intent queries
* **Transport:** MCP (Model Context Protocol) — runs as a local stdio server via `npx`

### Evaluator-Optimizer Loop
1. **Ingestion** — RAG retrieval of best practices from the Knowledge Vault
2. **Gap Analysis** — identifies missing context; asks clarification questions if clarity score < 0.7
3. **Synthesis** — Gemma 3n generates the optimized prompt
4. **Audit** — internal regression against a G-Eval rubric (Faithfulness, Specificity, Structure)

---

## 📈 Performance

* **Latency:** Average TTFT < 350ms via Together AI Serverless
* **Context Grounding:** 100% of generated prompts include citations from the Knowledge Vault
* **Optimization Alpha:** Average 25–35% reduction in Prompt Drift vs. raw user input

---

## 🛠️ Getting Started

### Option 1 — One-Click Install (Claude Code Plugin)

Install directly from the Claude Code plugin marketplace:

```
promptpilot
```

The plugin prompts for your API keys and injects them automatically — no manual config needed.

### Option 2 — Manual Install via npx

Add PromptPilot as an MCP server in your Claude Code settings:

```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "promptpilot-mcp@latest"],
      "env": {
        "TOGETHER_API_KEY": "your_key",
        "SUPABASE_URL": "your_url",
        "SUPABASE_SERVICE_ROLE_KEY": "your_key",
        "UPSTASH_REDIS_REST_URL": "your_url",
        "UPSTASH_REDIS_REST_TOKEN": "your_token"
      }
    }
  }
}
```

### Option 3 — Local Development

#### Prerequisites
* Node.js 18+
* Together AI API Key
* Supabase project with `pgvector` enabled
* Upstash Redis (optional, for semantic caching)

#### Setup

```bash
git clone https://github.com/Krapa007/PromptPilot.git
cd PromptPilot/cli
npm install
```

Create a `.env` or `.env.local` file:

```env
TOGETHER_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

Run the installer to wire PromptPilot into your local Claude Code config:

```bash
node bin/promptpilot.js install
```

Or run the MCP server directly:

```bash
node bin/mcp.js
```

#### Seed the Knowledge Vault

```bash
node --env-file=.env scripts/ingest_research.mjs
```

---

## 📦 npm Package

The MCP server is published as [`promptpilot-mcp`](https://www.npmjs.com/package/promptpilot-mcp) on npm.

```bash
npm install -g promptpilot-mcp
```

---

## 🗺️ Roadmap

* **[ ] Multimodal Intent:** Support for image-to-prompt (Visual Prompt Engineering)
* **[ ] Team Workspaces:** Collaborative Knowledge Vaults for enterprise teams
* **[ ] Live Eval Dashboard:** Public-facing metrics on prompt "Win Rates" using Sonnet 4.6 auditing
* **[ ] VS Code Extension:** Native IDE prompt interception without Claude Code

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed by Kalyan Krapa**
