import natural from 'natural';
import Sentiment from 'sentiment';

const tokenizer = new natural.WordTokenizer();
const sentiment = new Sentiment();

export class ToneAnalyzer {
    static analyzeMessage(message: string) {
        const tokens = tokenizer.tokenize(message) || [];
        const sentimentResult = sentiment.analyze(message);
        
        // Calculate engagement based on message length and question marks
        const engagement = this.calculateEngagement(message, tokens);
        
        // Calculate interest based on sentiment and specific markers
        const interest = this.calculateInterest(message, sentimentResult);
        
        // Determine overall sentiment
        const overallSentiment = this.determineOverallSentiment(sentimentResult.comparative);

        return {
            interest,
            engagement,
            sentiment: overallSentiment,
            raw: {
                tokens,
                sentiment: sentimentResult
            }
        };
    }

    private static calculateEngagement(message: string, tokens: string[]): number {
        const factors = {
            messageLength: Math.min(tokens.length / 20, 1), // Normalize to 0-1
            questionMarks: (message.match(/\?/g) || []).length * 0.2,
            exclamationMarks: (message.match(/!/g) || []).length * 0.1,
            personalPronouns: this.countPersonalPronouns(tokens) * 0.15
        };

        const engagementScore = Object.values(factors).reduce((sum, value) => sum + value, 0);
        return Math.min(Math.max(engagementScore, 0), 1);
    }

    private static calculateInterest(message: string, sentimentResult: any): number {
        const factors = {
            sentimentScore: (sentimentResult.comparative + 5) / 10, // Normalize from -5,5 to 0,1
            questionPresence: message.includes('?') ? 0.2 : 0,
            enthusiasticMarkers: this.countEnthusiasticMarkers(message) * 0.15,
            followUpIndicators: this.hasFollowUpIndicators(message) ? 0.2 : 0
        };

        const interestScore = Object.values(factors).reduce((sum, value) => sum + value, 0);
        return Math.min(Math.max(interestScore, 0), 1);
    }

    private static determineOverallSentiment(comparative: number): 'positive' | 'neutral' | 'negative' {
        if (comparative > 0.2) return 'positive';
        if (comparative < -0.2) return 'negative';
        return 'neutral';
    }

    private static countPersonalPronouns(tokens: string[]): number {
        const personalPronouns = ['i', 'you', 'we', 'my', 'your', 'our'];
        return tokens.filter(token => personalPronouns.includes(token.toLowerCase())).length;
    }

    private static countEnthusiasticMarkers(message: string): number {
        const markers = [
            '!', 'wow', 'great', 'awesome', 'cool', 'nice', 'love', 'perfect',
            'interesting', 'amazing', 'excellent', 'fantastic'
        ];
        
        return markers.reduce((count, marker) => 
            count + (message.toLowerCase().match(new RegExp(marker, 'g')) || []).length, 0);
    }

    private static hasFollowUpIndicators(message: string): boolean {
        const indicators = [
            'what about', 'how about', 'tell me more', 'and you',
            'what do you', 'have you', 'would you', 'do you'
        ];
        
        return indicators.some(indicator => 
            message.toLowerCase().includes(indicator));
    }
} 