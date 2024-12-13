# AI Dating Coach: Advanced Conversational Assistant 🤖

A sophisticated AI-powered dating coach that helps users maintain engaging conversations on dating platforms. Built using advanced LLM techniques including Prompt Engineering, Fine-tuning, and RAG (Retrieval-Augmented Generation).

## Core Components

### 1. Prompt Engineering 🎯
- **Systematic Prompting Strategy**
  - Context-aware persona management
  - Dynamic conversation stage tracking
  - Goal-oriented message generation
  - Tech-savvy humor and wordplay integration

- **Context Management**
  - User profile preservation
  - Conversation history tracking
  - Engagement metrics monitoring
  - Stage-based response adaptation

- **Specialized Flows**
  - Initial rapport building
  - Phone number acquisition
  - Date planning
  - Meeting arrangement

### 2. Fine-Tuning 🔧
- **Training Data**
  - Successful dating conversations
  - Tech-humor examples
  - Engagement patterns
  - Goal achievement cases

- **Model Optimization**
  - Base: GPT-3.5-turbo
  - Domain: Dating and relationship building
  - Focus: Natural tech-savvy personality
  - Metrics: Engagement, sentiment, goal progress

### 3. RAG Implementation 📚
- **Knowledge Base**
  - Dating platform best practices
  - Conversation strategies
  - Tech humor and puns
  - Cultural references

- **Vector Storage**
  - Conversation embeddings
  - Response templates
  - Success patterns
  - User preferences

## RAG Knowledge Base

The chatbot utilizes a Retrieval-Augmented Generation (RAG) system with a comprehensive knowledge base located in `backend/src/data/`. This knowledge base includes:

### Pickup Lines Dataset
- `pickuplines.csv`: Primary dataset with 6,000+ pickup lines for diverse contexts
- `formatted_pickup_lines.csv`: Cleaned and formatted version with 700+ high-quality lines
- `categorizedlines.csv`: Categorized pickup lines with tags for different situations
- `pick-up-lines.txt`: Raw collection of pickup lines for additional training

### User Interaction Data
- `user_messages.csv`: Collection of real user messages and interactions for the `/upload` API endpoint
  - Used for continuous improvement of response quality
  - Helps in understanding user engagement patterns
  - Supports dynamic adaptation of conversation styles

The RAG system combines these datasets with:
1. Real-time context understanding
2. Persona-specific response generation (tech-savvy software engineer)
3. Dynamic retrieval based on conversation goals
4. Adaptive response selection using engagement metrics

### Fine-tuning Dataset Structure
Located in `backend/data/training/`:
- `successful_conversations.jsonl`: Complete conversation examples with metrics
- `tech_humor.jsonl`: Tech-themed humor responses
- `recovery_conversations.jsonl`: Conversation recovery patterns
- `goal_patterns.jsonl`: Goal-oriented conversation strategies

## API Endpoints

### 1. POST /api/chatbot/chat
Generate contextual responses for dating app messages.
```json
POST /api/chatbot/chat
{
  "message": string,
  "userId": string,
  "context": {
    "goal": "GET_PHONE_NUMBER" | "SET_DATE" | "ASK_OUT" | "BUILD_RAPPORT",
    "matchInfo": {
      "platform": string,
      "userGender": string,
      "matchGender": string,
      "conversationStage": "initial" | "building_rapport" | "advancing" | "closing"
    }
  }
}
```

### 2. POST /api/conversation/generate
Generate specialized pickup lines and conversation starters.
```json
POST /api/conversation/generate
{
  "bio": string,
  "userId": string
}
```

### 3. POST /api/messages/upload
Upload and analyze message history for training and improvement.
```json
POST /api/messages/upload
{
  "userId": string,
  "messages": [
    {
      "text": string,
      "timestamp": string,
      "role": "user" | "match"
    }
  ]
}
```

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- OpenAI GPT-3.5 with Fine-tuning
- LangChain for RAG implementation
- Natural Language Processing (natural.js)
- Vector Storage (Pinecone)
- Sentiment Analysis

### Frontend
- React with TypeScript
- Tailwind CSS
- React Icons
- Real-time Analysis Display

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Pinecone API key

### Environment Setup
Create a .env file in the backend directory:
```bash
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
PORT=3000
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Project Structure
```
.
├── backend/
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Core business logic
│   │   ├── middleware/          # Request handling
│   │   ├── scripts/             # Utility scripts
│   │   │   └── chatbot/         # Chatbot core
│   │   │       ├── types.ts
│   │   │       ├── promptEngineering.ts
│   │   │       ├── toneAnalyzer.ts
│   │   │       └── testScript.ts
│   │   └── utils/              # Helper functions
│   ├── data/                   # Training data
│   │   ├── conversations/      # Example conversations
│   │   └── prompts/           # Prompt templates
│   └── tests/                 # Test suites
└── client/
    ├── src/
    │   ├── components/
    │   │   └── chatBot/       # Chat components
    │   ├── services/          # API services
    │   └── pages/            # Main pages
    └── public/
```

## Features

### Conversation Analysis
- Real-time tone analysis
- Engagement tracking
- Sentiment analysis
- Progress monitoring

### Smart Response Generation
- Context-aware responses
- Personality maintenance
- Tech humor integration
- Goal progression

### Training and Improvement
- Conversation data collection
- Performance metrics
- Model fine-tuning
- Knowledge base updates

## Example Conversations

### Initial Stage - Profile Response
```
User: "Hey! I noticed you're into hiking from your profile."

AI: "404: Perfect pickup line not found... but my debugging skills spotted a fellow adventurer! 🏔️ 

What's your favorite trail around here?"

Analysis:
- Stage: initial
- Tone: playful, engaging
- Goal: BUILD_RAPPORT
- Engagement: 0.8
```

### Building Rapport - Tech Humor
```
Match: "What do you do for work?"

AI: "I write code that only crashes 50% of the time... my success rate with pickup lines is slightly better 😉

How about you? Any bugs in your system I should know about?"

Analysis:
- Stage: building_rapport
- Tone: humorous, confident
- Goal: BUILD_RAPPORT
- Engagement: 0.85
```

### Advancing - Food Interest
```
Match: "I love trying new restaurants!"

AI: "My code might have bugs, but my taste in Indian food is error-free 🌶️

Care to debug some curries together at that new place downtown?"

Analysis:
- Stage: advancing
- Tone: flirty, playful
- Goal: SET_DATE
- Engagement: 0.9
```

### Closing - Number Exchange
```
Match: "Yeah, we should definitely check it out!"

AI: "My app's throwing a MissingNumberException - think you could help resolve this bug? 📱

Would love to coordinate our foodie adventure properly!"

Analysis:
- Stage: closing
- Tone: clever, direct
- Goal: GET_PHONE_NUMBER
- Engagement: 0.95
```

### Special Cases

#### Recovery from Low Engagement
```
Match: "k"

AI: "Running diagnostics on our chat... found a fun fact: I'm actually quite good at debugging conversations 💭

What kind of things make you light up with excitement?"

Analysis:
- Stage: building_rapport
- Tone: light, inviting
- Goal: BUILD_RAPPORT
- Engagement: 0.4 -> 0.6
```

#### Multiple Interests Connection
```
Match: "I see you like both movies and Indian food!"

AI: "Finally, someone who appreciates both code compilation AND curry combinations! 🎬

Which do you prefer: debugging spicy food tolerance or discovering plot twists?"

Analysis:
- Stage: building_rapport
- Tone: enthusiastic, witty
- Goal: BUILD_RAPPORT
- Engagement: 0.85
```

### RAG-Enhanced Responses
```
Match: "What's your favorite sci-fi movie?"

AI: "As a software engineer, I'm legally obligated to say 'The Matrix' 🤖

But real talk - Christopher Nolan's 'Inception' had me questioning my code's reality. Your favorite mind-bending film?"

Analysis:
- Stage: building_rapport
- Tone: humorous, authentic
- Knowledge Base: Movie references, tech culture
- Engagement: 0.9
```

Each conversation example demonstrates:
- Context-aware responses
- Persona consistency
- Tech humor integration
- Goal progression
- Engagement metrics
- RAG knowledge utilization

## Fine-tuning Datasets

### Dataset Structure
The fine-tuning data is stored in JSONL format in `backend/data/training/`. Here's a sample of our dataset structure:

```jsonl
// successful_conversations.jsonl
{
  "messages": [
    {"role": "system", "content": "You are a software engineer who loves movies and Indian food..."},
    {"role": "user", "content": "What do you do for work?"},
    {"role": "assistant", "content": "I write code that only crashes 50% of the time... my success rate with pickup lines is slightly better 😉 How about you?"},
    {"role": "user", "content": "Haha, I'm a graphic designer!"},
    {"role": "assistant", "content": "A perfect match - you make things look good, I make them work! Though sometimes my code could use a designer's touch 🎨"}
  ],
  "metrics": {
    "engagement": 0.9,
    "goal_achieved": true,
    "conversation_length": 6
  }
}
```

### Dataset Categories

1. **Successful Conversations** (`successful_conversations.jsonl`)
```json
{
  "conversation_id": "conv_123",
  "platform": "Hinge",
  "goal": "SET_DATE",
  "messages": [...],
  "outcome": {
    "goal_achieved": true,
    "num_messages": 12,
    "time_to_goal": "2 hours",
    "engagement_metrics": {
      "average_response_time": 180,
      "message_length_average": 42,
      "emoji_usage": 0.3
    }
  }
}
```

2. **Tech Humor Examples** (`tech_humor.jsonl`)
```json
{
  "context": "responding_to_work_question",
  "setup": "What do you do for work?",
  "response": "I'm a software engineer - I turn coffee into code and bugs into features 💻",
  "humor_type": "tech_pun",
  "engagement_score": 0.85
}
```

3. **Recovery Scenarios** (`recovery_conversations.jsonl`)
```json
{
  "scenario": "low_engagement",
  "initial_message": "k",
  "recovery_response": "Running diagnostics on our chat... found a fun fact: I'm actually quite good at debugging conversations 💭",
  "success_rate": 0.75,
  "engagement_delta": 0.3
}
```

4. **Goal Achievement Patterns** (`goal_patterns.jsonl`)
```json
{
  "goal": "GET_PHONE_NUMBER",
  "successful_pattern": {
    "stage1": "establish_rapport",
    "stage2": "create_reason",
    "stage3": "casual_request",
    "messages": [...],
    "success_indicators": [
      "positive_response",
      "immediate_share",
      "continued_engagement"
    ]
  }
}
```

### Training Distribution

- Successful Conversations: 5000 examples
- Tech Humor Samples: 1000 examples
- Recovery Scenarios: 800 examples
- Goal Achievement Patterns: 1200 examples

### Sample Sizes
- Training Set: 80% (6400 conversations)
- Validation Set: 10% (800 conversations)
- Test Set: 10% (800 conversations)

### Data Collection Methods

1. **Manual Curation**
   - Expert-reviewed conversations
   - Verified successful outcomes
   - Diverse conversation flows

2. **Automated Filtering**
   - Engagement score > 0.7
   - Goal achievement rate > 60%
   - Response quality metrics
   - Natural language patterns

3. **Quality Metrics**
   - Message coherence
   - Persona consistency
   - Humor effectiveness
   - Goal progression

## Performance Metrics

- Response Generation: < 2s
- Tone Analysis: < 500ms
- Context Processing: < 100ms
- RAG Retrieval: < 1s

## Future Improvements

1. **Enhanced Personalization**
   - User preference learning
   - Style adaptation
   - Cultural awareness

2. **Advanced Analytics**
   - Success rate tracking
   - Pattern recognition
   - Optimization suggestions

3. **Platform Integration**
   - Direct dating app connections
   - Multi-platform support
   - Real-time notifications