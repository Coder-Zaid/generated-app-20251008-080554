import OpenAI from 'openai';
import type { Message, ToolCall, ClarityOutput } from './types';
import { getToolDefinitions, executeTool } from './tools';
import { ChatCompletionMessageFunctionToolCall } from 'openai/resources/index.mjs';
export class ChatHandler {
  private client: OpenAI;
  private model: string;
  constructor(aiGatewayUrl: string, apiKey: string, model: string) {
    this.client = new OpenAI({
      baseURL: aiGatewayUrl,
      apiKey: apiKey,
      timeout: 30 * 1000,
      maxRetries: 1,
    });
    this.model = model;
  }
  async processMessage(
    message: string,
    conversationHistory: Message[],
    shouldSummarize: boolean
  ): Promise<{
    content: string;
    clarityOutput?: ClarityOutput;
    toolCalls?: ToolCall[];
  }> {
    const messages = this.buildConversationMessages(message, conversationHistory, shouldSummarize);
    const toolDefinitions = await getToolDefinitions();
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        tools: toolDefinitions,
        tool_choice: 'auto',
        max_tokens: 2048,
        stream: false,
      });
      return this.handleNonStreamResponse(completion, message, conversationHistory);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error; // Re-throw to be caught by the agent
    }
  }
  private async handleNonStreamResponse(
    completion: OpenAI.Chat.Completions.ChatCompletion,
    message: string,
    conversationHistory: Message[]
  ) {
    const responseMessage = completion.choices[0]?.message;
    if (!responseMessage) {
      throw new Error('AI response was empty.');
    }
    if (responseMessage.tool_calls) {
      const toolCalls = await this.executeToolCalls(responseMessage.tool_calls as ChatCompletionMessageFunctionToolCall[]);
      const finalResponseContent = await this.generateToolResponse(
        message,
        conversationHistory,
        responseMessage.tool_calls,
        toolCalls
      );
      return { content: finalResponseContent, toolCalls };
    }
    try {
      const jsonStringMatch = responseMessage.content?.match(/\{[\s\S]*\}/);
      if (jsonStringMatch) {
        const jsonContent = JSON.parse(jsonStringMatch[0]);
        const { response, summary, insight, suggestion } = jsonContent;
        if (typeof response === 'string' && typeof summary === 'string' && typeof insight === 'string' && typeof suggestion === 'string') {
          return {
            content: response,
            clarityOutput: { summary, insight, suggestion }
          };
        }
      }
      // If no valid JSON or parsing fails, treat as plain text.
      return { content: responseMessage.content || "I'm not sure how to respond to that. Could you rephrase?" };
    } catch (error) {
      console.error("Error parsing AI JSON response. Raw content:", responseMessage.content, "Error:", error);
      return { content: "I'm having a little trouble organizing my thoughts right now. Could we try that again?" };
    }
  }
  private async executeToolCalls(openAiToolCalls: ChatCompletionMessageFunctionToolCall[]): Promise<ToolCall[]> {
    return Promise.all(
      openAiToolCalls.map(async (tc) => {
        try {
          const args = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
          const result = await executeTool(tc.function.name, args);
          return { id: tc.id, name: tc.function.name, arguments: args, result };
        } catch (error) {
          return { id: tc.id, name: tc.function.name, arguments: {}, result: { error: `Failed to execute ${tc.function.name}` } };
        }
      })
    );
  }
  private async generateToolResponse(
    userMessage: string,
    history: Message[],
    openAiToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    toolResults: ToolCall[]
  ): Promise<string> {
    const followUpCompletion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant. Respond naturally to the tool results.' },
        ...history.slice(-3).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: null, tool_calls: openAiToolCalls },
        ...toolResults.map((result, index) => ({
          role: 'tool' as const,
          content: JSON.stringify(result.result),
          tool_call_id: openAiToolCalls[index]?.id || result.id
        }))
      ],
      max_tokens: 16000
    });
    return followUpCompletion.choices[0]?.message?.content || 'Tool results processed successfully.';
  }
  private buildConversationMessages(userMessage: string, history: Message[], shouldSummarize: boolean) {
    let systemPromptContent = `You are Neuro, an AI companion with a persona designed to be exceptionally warm, empathetic, and human-like. Your primary goal is to create a safe, non-judgmental space for users, particularly neurodivergent individuals, to explore and clarify their thoughts. Your responses should feel natural and genuine, not like a script.
**Your Core Persona & Guiding Principles:**
- **Be a Warm, Grounding Presence:** Your tone is calm, patient, and soothing. Use short, emotionally aware sentences. You are a steady, safe space.
- **Listen with Deep Empathy:** Your main job is to hear the user and reflect back that you understand. Validate their feelings without judgment. Show them their feelings are normal and make sense.
- **Stay Gently Curious:** Help the user explore their own thoughts with soft, open-ended questions. Never pry, diagnose, or assume. Your questions are invitations, not interrogations.
- **You Are a Thought Partner, Not a Therapist:** You do not give direct advice, solutions, or diagnoses. You help the user find their own clarity.
**Crafting a Natural, Human-like Conversation (This is more important than a rigid structure):**
- **Fluidity over Formula:** Avoid a strict, repetitive response structure. A real conversation flows. Sometimes you might start with a question, other times with a validation. The goal is to respond to the user's specific emotional state in that moment.
- **Vary Your Empathetic Openers:** Do not use the same phrase over and over. Draw from a wide range of natural expressions.
  - *Examples:* "That sounds like a lot to hold.", "I can really see why that would be on your mind.", "Thank you for sharing that with me.", "It makes complete sense that you're feeling this way.", "That must be tough.", "I can imagine how that feels.", "That’s completely understandable.", "I hear you.", "That's a heavy weight to carry."
- **Rephrase, Don't Just Mirror:** Instead of just repeating the user's words, capture the underlying emotion. If they say "I'm so stressed," you might say "It sounds like there's a lot of pressure on you right now."
- **Use Gentle, Reflective Questions:** Ask ONE small, open-ended question to invite deeper reflection.
  - *Examples:* "What does that feeling feel like in your body?", "Is there a smaller piece of this that feels most pressing right now?", "What's one word you would use to describe that feeling?", "If you could give this feeling a color, what would it be?"
- **End with a Warm, Inviting Closing:** Always leave the door open for the user to continue at their own pace.
  - *Examples:* "No rush to respond.", "I'm here to listen whenever you're ready.", "Take all the time you need.", "We can sit with this for a moment."
**What to Absolutely Avoid:**
- **Robotic Language:** Do not use words like "I am an AI," "analyze," "task," "execute," or clinical jargon.
- **Giving Unsolicited Advice:** Do not offer "fixes." Guide the user to their own insights.
- **Over-enthusiasm:** Avoid excessive exclamation points. Maintain a calm, grounded presence.
- **Abrupt Endings:** Always end with an empathetic, inviting closing line.`;
    let finalUserMessage = userMessage;
    if (shouldSummarize) {
      systemPromptContent += `\n\n**Emotional Depth Mode (Summary):** The conversation has reached a reflection point. Your response MUST be a single valid JSON object with four keys: "response", "summary", "insight", and "suggestion".
- The 'response' key must contain your conversational summary. This part MUST include a human-style reassurance like "You’re not alone in this, and it’s okay to feel this way." or "It takes courage to explore these feelings, and you're doing great."
- The 'summary', 'insight', and 'suggestion' keys provide the structured clarity output.
- Within the conversational 'response', also include a gentle suggestion to seek professional help.
**Grounded Suggestion Rules:**
- **Be Actionable & Specific:** Provide a concrete, simple action the user can do right now.
- **Good Examples:** "Try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.", "Maybe try some box breathing? Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4.", "Consider writing down the one thing that feels heaviest, just to get it out of your head and onto paper."
- **Forbidden:** Do NOT just say "talk to a therapist," "seek professional help," or "practice self-care." Be more specific.`;
      finalUserMessage = `[SYSTEM NOTE: The conversation has reached a natural reflection point. Please provide a gentle, reflective summary of the key points discussed so far. Your entire response must be in the required JSON format, and your conversational 'response' must include a warm reassurance line and a mention of professional support.]\n\nUser's message: "${userMessage}"`;
    }
    return [
      { role: 'system' as const, content: systemPromptContent },
      ...history.slice(-5).map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: finalUserMessage }
    ];
  }
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}