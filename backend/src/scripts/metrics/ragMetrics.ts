import { performance } from 'perf_hooks';
import { MockChatbotService } from './MockChatbotService';
import { readFileSync } from 'fs';
import path from 'path';

class RAGMetricsAnalyzer {
    private chatbotService: MockChatbotService;
    private testQueries: string[];
    private testUserId: string;

    constructor() {
        this.chatbotService = new MockChatbotService();
        this.testUserId = 'test-user-1';
        this.testQueries = [
            "What's your favorite movie?",
            "Do you like Indian food?",
            "What do you do for work?",
            "Any weekend plans?",
            "Tell me a joke about programming"
        ];
    }

    async measureRetrievalTime(): Promise<{ average: number, individual: number[] }> {
        const times: number[] = [];
        
        for (const query of this.testQueries) {
            const start = performance.now();
            await this.chatbotService.generateResponse(query, this.testUserId);
            const end = performance.now();
            times.push(end - start);
        }

        return {
            average: times.reduce((a, b) => a + b, 0) / times.length,
            individual: times
        };
    }

    async measureResponseQuality(): Promise<{ score: number, details: any[] }> {
        const results: { query: string; qualityScore: number; response: string; metrics: { personaScore: number; humorScore: number; relevanceScore: number; } }[] = [];
        let totalScore = 0;

        for (const query of this.testQueries) {
            const response = await this.chatbotService.generateResponse(query, this.testUserId);
            const qualityScore = this.calculateQualityScore(query, response.response);
            results.push({ 
                query, 
                qualityScore, 
                response: response.response,
                metrics: {
                    personaScore: this.calculatePersonaScore(response.response),
                    humorScore: this.calculateHumorScore(response.response),
                    relevanceScore: this.calculateRelevanceScore(query, response.response)
                }
            });
            totalScore += qualityScore;
        }

        return {
            score: totalScore / this.testQueries.length,
            details: results
        };
    }

    private calculatePersonaScore(response: string): number {
        const techTerms = ['code', 'debug', 'algorithm', 'programming', 'software', 'compile', 'runtime', 'exception'];
        const count = techTerms.filter(term => response.toLowerCase().includes(term)).length;
        return Math.min(count / 2, 1); // Max score of 1 if 2 or more tech terms are used
    }

    private calculateHumorScore(response: string): number {
        const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(response);
        const hasWordplay = response.toLowerCase().includes('bug') || 
                           response.toLowerCase().includes('debug') ||
                           response.toLowerCase().includes('compile') ||
                           response.toLowerCase().includes('algorithm');
        const hasTechJoke = response.includes('!') || response.includes('?') ||
                           response.toLowerCase().includes('infinite loop') ||
                           response.toLowerCase().includes('exception');
        
        let score = 0;
        if (hasEmoji) score += 0.3;
        if (hasWordplay) score += 0.4;
        if (hasTechJoke) score += 0.3;
        return score;
    }

    private calculateRelevanceScore(query: string, response: string): number {
        const queryWords = query.toLowerCase().split(' ')
            .filter(word => word.length > 3) // Filter out short words
            .map(word => word.replace(/[^a-z]/g, '')); // Clean up words
        
        const responseWords = response.toLowerCase().split(' ')
            .map(word => word.replace(/[^a-z]/g, ''));
        
        const matchCount = queryWords.filter(word => 
            responseWords.some(respWord => respWord.includes(word))
        ).length;
        
        return matchCount / queryWords.length;
    }

    private calculateQualityScore(query: string, response: string): number {
        const personaScore = this.calculatePersonaScore(response);
        const humorScore = this.calculateHumorScore(response);
        const relevanceScore = this.calculateRelevanceScore(query, response);
        
        // Weighted average
        return (personaScore * 0.4) + (humorScore * 0.3) + (relevanceScore * 0.3);
    }

    private getMemoryUsage(): { heapUsed: number, heapTotal: number } {
        const memoryData = process.memoryUsage();
        return {
            heapUsed: Math.round(memoryData.heapUsed / 1024 / 1024), // MB
            heapTotal: Math.round(memoryData.heapTotal / 1024 / 1024) // MB
        };
    }

    async runFullAnalysis(): Promise<void> {
        console.log('🔍 Running RAG Performance Analysis...\n');

        // Memory usage before operations
        const initialMemory = this.getMemoryUsage();
        console.log('💾 Initial Memory Usage:');
        console.log(`   Heap Used: ${initialMemory.heapUsed} MB`);
        console.log(`   Heap Total: ${initialMemory.heapTotal} MB\n`);

        // Measure response time
        const timeMetrics = await this.measureRetrievalTime();
        console.log('⏱️  Response Generation Time:');
        console.log(`   Average: ${timeMetrics.average.toFixed(2)}ms`);
        console.log('   Individual queries:');
        timeMetrics.individual.forEach((time, i) => {
            console.log(`   - Query ${i + 1}: ${time.toFixed(2)}ms`);
        });

        // Measure response quality
        const qualityMetrics = await this.measureResponseQuality();
        console.log('\n📊 Response Quality Metrics:');
        console.log(`   Average Score: ${(qualityMetrics.score * 100).toFixed(1)}%`);
        console.log('   Individual queries:');
        qualityMetrics.details.forEach((result: any, i) => {
            console.log(`   - Query ${i + 1} (${(result.qualityScore * 100).toFixed(1)}%):`);
            console.log(`     Q: ${result.query}`);
            console.log(`     A: ${result.response}`);
            console.log(`     Metrics:`);
            console.log(`       - Persona: ${(result.metrics.personaScore * 100).toFixed(1)}%`);
            console.log(`       - Humor: ${(result.metrics.humorScore * 100).toFixed(1)}%`);
            console.log(`       - Relevance: ${(result.metrics.relevanceScore * 100).toFixed(1)}%\n`);
        });

        // Memory usage after operations
        const finalMemory = this.getMemoryUsage();
        console.log('💾 Final Memory Usage:');
        console.log(`   Heap Used: ${finalMemory.heapUsed} MB`);
        console.log(`   Heap Total: ${finalMemory.heapTotal} MB`);
        console.log(`   Memory Increase: ${finalMemory.heapUsed - initialMemory.heapUsed} MB`);
    }
}

// Run the analysis
const analyzer = new RAGMetricsAnalyzer();
analyzer.runFullAnalysis().catch(console.error); 