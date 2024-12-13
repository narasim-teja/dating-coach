import { readFileSync } from 'fs';
import path from 'path';
import { MockChatbotService } from './MockChatbotService';

interface ConversationMetrics {
    personaConsistency: number;
    humorEffectiveness: number;
    goalAchievement: number;
    responseQuality: number;
}

export class FinetuningMetricsAnalyzer {
    private chatbotService: MockChatbotService;
    private testCases: any[];

    constructor() {
        this.chatbotService = new MockChatbotService();
        this.testCases = this.loadTestCases();
    }

    private loadTestCases(): any[] {
        try {
            const filePath = path.join(__dirname, '../../../data/training/successful_conversations.jsonl');
            const fileContent = readFileSync(filePath, 'utf-8');
            return fileContent.split('\n')
                .filter(line => line.trim())
                .map(line => JSON.parse(line));
        } catch (error) {
            console.error('Error loading test cases:', error);
            return [];
        }
    }

    async analyzePersonaConsistency(): Promise<number> {
        let totalScore = 0;
        const techKeywords = ['code', 'debug', 'algorithm', 'programming', 'software'];
        
        for (const testCase of this.testCases) {
            const responses = testCase.messages
                .filter((msg: { role: string }) => msg.role === 'assistant')
                .map((msg: { content: string }) => msg.content);
            
            const scores = responses.map((response: string) => {
                const keywordCount = techKeywords.filter(keyword => 
                    response.toLowerCase().includes(keyword)
                ).length;
                return keywordCount / techKeywords.length;
            });
            
            totalScore += scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        }
        
        return totalScore / this.testCases.length;
    }

    async analyzeHumorEffectiveness(): Promise<number> {
        try {
            const humorFile = path.join(__dirname, '../../../data/training/tech_humor.jsonl');
            const humorContent = readFileSync(humorFile, 'utf-8');
            const humorData = humorContent.split('\n')
                .filter(line => line.trim())
                .map(line => JSON.parse(line));
            
            return humorData.reduce((acc: number, curr: { engagement_score: number }) => 
                acc + (curr.engagement_score || 0), 0) / humorData.length;
        } catch (error) {
            console.error('Error analyzing humor:', error);
            return 0;
        }
    }

    async analyzeGoalAchievement(): Promise<number> {
        return this.testCases.filter((tc: { outcome: { goal_achieved: boolean } }) => 
            tc.outcome.goal_achieved).length / this.testCases.length;
    }

    async analyzeResponseQuality(): Promise<number> {
        let totalScore = 0;
        
        for (const testCase of this.testCases) {
            const metrics = testCase.outcome.engagement_metrics;
            const score = (
                (metrics.average_response_time < 200 ? 1 : 0.5) +
                (metrics.message_length_average < 100 ? 1 : 0.5) +
                (metrics.emoji_usage || 0)
            ) / 3;
            totalScore += score;
        }
        
        return totalScore / this.testCases.length;
    }

    async runFullAnalysis(): Promise<void> {
        console.log('📊 Running Fine-tuning Performance Analysis...\n');

        try {
            // Analyze persona consistency
            const personaScore = await this.analyzePersonaConsistency();
            console.log('🤖 Persona Consistency:');
            console.log(`   Score: ${(personaScore * 100).toFixed(1)}%`);

            // Analyze humor effectiveness
            const humorScore = await this.analyzeHumorEffectiveness();
            console.log('\n😄 Humor Effectiveness:');
            console.log(`   Score: ${(humorScore * 100).toFixed(1)}%`);

            // Analyze goal achievement
            const goalScore = await this.analyzeGoalAchievement();
            console.log('\n🎯 Goal Achievement:');
            console.log(`   Score: ${(goalScore * 100).toFixed(1)}%`);

            // Analyze response quality
            const qualityScore = await this.analyzeResponseQuality();
            console.log('\n✨ Response Quality:');
            console.log(`   Score: ${(qualityScore * 100).toFixed(1)}%`);

            // Overall score
            const overallScore = (personaScore + humorScore + goalScore + qualityScore) / 4;
            console.log('\n📈 Overall Fine-tuning Performance:');
            console.log(`   Score: ${(overallScore * 100).toFixed(1)}%`);
        } catch (error) {
            console.error('Error running analysis:', error);
        }
    }
}

// Run the analysis
const analyzer = new FinetuningMetricsAnalyzer();
analyzer.runFullAnalysis().catch(console.error); 