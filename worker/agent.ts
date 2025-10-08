import { Agent } from 'agents';
import { APIError } from 'openai';
import type { Env } from './core-utils';
import type { ChatState } from './types';
import { ChatHandler } from './chat';
import { API_RESPONSES } from './config';
import { createMessage } from './utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash',
    summaryOffered: false
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  async onRequest(request: Request): Promise<Response> {
    if (
      !this.env.CF_AI_BASE_URL || this.env.CF_AI_BASE_URL.includes('YOUR_ACCOUNT_ID') ||
      !this.env.CF_AI_API_KEY || this.env.CF_AI_API_KEY.includes('your-cloudflare-api-key')
    ) {
      return Response.json({
        success: false,
        error: 'AI Gateway not configured.'
      }, { status: 500 });
    }
    try {
      const url = new URL(request.url);
      const method = request.method;
      if (method === 'GET' && url.pathname === '/messages') {
        return this.handleGetMessages();
      }
      if (method === 'POST' && url.pathname === '/chat') {
        return this.handleChatMessage(await request.json());
      }
      if (method === 'DELETE' && url.pathname === '/clear') {
        return this.handleClearMessages();
      }
      if (method === 'POST' && url.pathname === '/model') {
        return this.handleModelUpdate(await request.json());
      }
      return Response.json({ success: false, error: API_RESPONSES.NOT_FOUND }, { status: 404 });
    } catch (error) {
      console.error('Request handling error:', error);
      return Response.json({ success: false, error: API_RESPONSES.INTERNAL_ERROR }, { status: 500 });
    }
  }
  private handleGetMessages(): Response {
    return Response.json({ success: true, data: this.state });
  }
  private async handleChatMessage(body: { message: string; model?: string }): Promise<Response> {
    const { message, model } = body;
    if (!message?.trim()) {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    if (model && model !== this.state.model) {
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
    }
    const shouldSummarize = this.state.messages.length === 10 && !this.state.summaryOffered;
    const conversationHistory = this.state.messages;
    const userMessage = createMessage('user', message.trim());
    this.setState({
      ...this.state,
      messages: [...conversationHistory, userMessage],
      isProcessing: true
    });
    try {
      if (!this.chatHandler) throw new Error('Chat handler not initialized');
      const response = await this.chatHandler.processMessage(
        message,
        conversationHistory,
        shouldSummarize
      );
      const assistantMessage = createMessage('assistant', response.content, response.toolCalls);
      if (response.clarityOutput) {
        assistantMessage.clarityOutput = response.clarityOutput;
      }
      this.setState({
        ...this.state,
        messages: [...this.state.messages, assistantMessage],
        isProcessing: false,
        summaryOffered: this.state.summaryOffered || shouldSummarize
      });
      return Response.json({ success: true, data: this.state });
    } catch (error) {
      console.error('Chat processing error:', error);
      this.setState({ ...this.state, isProcessing: false });
      let errorMessage: string = API_RESPONSES.PROCESSING_ERROR;
      if (error instanceof APIError) {
        switch (error.status) {
          case 401:
            errorMessage = API_RESPONSES.AI_AUTH_ERROR;
            break;
          case 400:
            errorMessage = API_RESPONSES.AI_INVALID_REQUEST_ERROR;
            break;
          case 429:
            errorMessage = API_RESPONSES.AI_RATE_LIMIT_ERROR;
            break;
          default:
            errorMessage = `AI Error (${error.status}): Please check the server logs.`;
        }
      } else if (error instanceof Error && error.message.toLowerCase().includes('timeout')) {
        errorMessage = API_RESPONSES.AI_TIMEOUT_ERROR;
      }
      return Response.json({ success: false, error: errorMessage }, { status: 500 });
    }
  }
  private handleClearMessages(): Response {
    this.setState({ ...this.state, messages: [], summaryOffered: false });
    return Response.json({ success: true, data: this.state });
  }
  private handleModelUpdate(body: { model: string }): Response {
    const { model } = body;
    this.setState({ ...this.state, model });
    this.chatHandler?.updateModel(model);
    return Response.json({ success: true, data: this.state });
  }
}