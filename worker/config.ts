export const API_RESPONSES = {
  MISSING_MESSAGE: 'Message required',
  INVALID_MODEL: 'Invalid model',
  PROCESSING_ERROR: 'Failed to process message',
  NOT_FOUND: 'Not Found',
  AGENT_ROUTING_FAILED: 'Agent routing failed',
  INTERNAL_ERROR: 'Internal Server Error',
  AI_TIMEOUT_ERROR: 'The AI response timed out. Please try again.',
  AI_AUTH_ERROR: 'AI authentication failed. Please check your API key and configuration.',
  AI_INVALID_REQUEST_ERROR: 'The AI received an invalid request. Please try rephrasing your message.',
  AI_RATE_LIMIT_ERROR: 'AI rate limit reached. Please try again later.'
} as const;