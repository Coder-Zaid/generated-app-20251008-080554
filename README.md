# Neuro: AI Thought Clarifier
Neuro is a visually stunning, therapeutic AI chat application designed as a safe space for neurodivergent users. It helps organize, clarify, and reframe complex or emotional thoughts. The core of the application is an empathetic AI assistant that listens without judgment, reflects the user's feelings, and helps structure thoughts into clear, emotionally intelligent messages. The UI is dark, minimalist, and calming, featuring glass-morphic cards, soft glowing accents, and subtle animations to create a soothing, focused environment.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Coder-Zaid/generated-app-20251008-080515)
## Key Features
- **Empathetic AI Chat:** A non-judgmental space to freely express and explore thoughts.
- **Thought Clarification:** Reframe messy or emotional thoughts into clear, emotionally intelligent messages.
- **Emotion Insight:** Gentle AI-powered suggestions to identify underlying emotions like anxiety or overstimulation.
- **Session Management:** Automatically saves chat history, allowing you to revisit and continue past conversations.
- **Soothing Interface:** A dark, minimalist aesthetic with glass-morphic elements and a calming animated particle background to promote focus and reduce stress.
- **Copy & Share:** Easily copy the AI-clarified message to share with friends, family, or coworkers.
## Technology Stack
- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Animation:** Framer Motion
- **State Management:** Zustand
- **Backend:** Cloudflare Workers, Hono
- **Persistence:** Cloudflare Agents (Durable Objects)
## Getting Started
Follow these instructions to set up and run the project locally.
### Prerequisites
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (v18 or later)
- [Bun](https://bun.sh/)
### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/neuro.git
    cd neuro
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
3.  **Set up environment variables:**
    Create a `.dev.vars` file in the root of the project for local development. This file is used by Wrangler to load environment variables.
    ```
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```
    - Replace `YOUR_ACCOUNT_ID` and `YOUR_GATEWAY_ID` with your Cloudflare account and AI Gateway details.
    - Replace `your-cloudflare-api-key` with a valid API key that has permissions for the AI Gateway.
## Development
To run the application in development mode, which includes both the Vite frontend and the Cloudflare Worker backend with hot-reloading:
```bash
bun run dev
```
This will start the development server, typically on `http://localhost:3000`.
**Note on Vite HMR:** You may see a `[vite] failed to connect to websocket` error in the browser console when running in the development preview environment. This is a known issue related to how the Vite HMR proxy works in this specific setup and does not affect the application's functionality or the final production build.
## Usage
- **Start a Conversation:** Simply type your thoughts into the chat input at the bottom of the screen.
- **Clarify Thoughts:** After a few exchanges, use the "Clarify" button to receive a polished summary and emotion insight from the AI.
- **Manage Sessions:** Use the sidebar to create new chats, switch between past conversations, or delete old sessions. All conversations are saved automatically.
## Deployment
This project is designed for seamless deployment to Cloudflare Pages.
1.  **Build the project:**
    This command bundles the React application and prepares the worker for deployment.
    ```bash
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    This command deploys your application using Wrangler. It will upload the static assets to Cloudflare Pages and the server-side logic to Cloudflare Workers.
    ```bash
    bun run deploy
    ```
    Before deploying, ensure you have configured your production environment variables in the Cloudflare dashboard under your project's settings.
Alternatively, you can deploy directly from your GitHub repository with one click:
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Coder-Zaid/generated-app-20251008-080515)
## Project Structure
- `src/`: Contains all the frontend code, including React components, pages, hooks, and styles.
- `worker/`: Contains the backend Cloudflare Worker code, including the Hono router, Agent (Durable Object) definitions, and AI chat logic.
- `public/`: Static assets that are served directly.
- `wrangler.jsonc`: Configuration file for the Cloudflare Worker.
## Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request.
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.
## License
This project is licensed under the MIT License. See the `LICENSE` file for details.