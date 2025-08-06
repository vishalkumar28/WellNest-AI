const geminiAiService = require('../src/services/geminiAiService');

describe('Gemini AI Service', () => {
  test('should generate a response', async () => {
    const userMessage = 'How can I improve my sleep?';
    const userContext = {
      moodRating: 6,
      stressLevel: 7,
      sleepHours: 5.5,
      sleepQuality: 4,
      energyLevel: 5
    };
    
    const response = await geminiAiService.generateResponse(
      userMessage, 
      [], // empty conversation history
      userContext,
      'test-user-id'
    );
    
    expect(response).toHaveProperty('content');
    expect(response).toHaveProperty('responseTime');
    expect(typeof response.content).toBe('string');
    expect(response.content.length).toBeGreaterThan(0);
  }, 10000); // 10 second timeout
  
  test('should provide fallback response', () => {
    const message = 'I am feeling very stressed';
    const response = geminiAiService._getFallbackResponse(message);
    expect(response).toContain('stress');
    expect(response.length).toBeGreaterThan(0);
  });
  
  test('should convert chat history', () => {
    const messages = [
      { sender: 'user', content: 'Hello' },
      { sender: 'bot', content: 'Hi there' },
      { sender: 'user', content: 'How are you?' }
    ];
    
    const converted = geminiAiService.convertChatHistory(messages);
    
    expect(converted).toHaveLength(3);
    expect(converted[0].role).toBe('user');
    expect(converted[1].role).toBe('assistant');
    expect(converted[2].role).toBe('user');
  });
});