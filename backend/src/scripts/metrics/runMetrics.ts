import { execSync } from 'child_process';
import path from 'path';

console.log('🚀 Running Performance Metrics Analysis\n');

try {
    // Run RAG metrics
    console.log('=======================================');
    console.log('Running RAG Performance Metrics...');
    console.log('=======================================\n');
    execSync('ts-node ' + path.join(__dirname, 'ragMetrics.ts'), { stdio: 'inherit' });
    
    console.log('\n');
    
    // Run Fine-tuning metrics
    console.log('=======================================');
    console.log('Running Fine-tuning Performance Metrics...');
    console.log('=======================================\n');
    execSync('ts-node ' + path.join(__dirname, 'finetuningMetrics.ts'), { stdio: 'inherit' });
    
    console.log('\n✅ All metrics analysis completed successfully!');
} catch (error) {
    console.error('❌ Error running metrics analysis:', error);
    process.exit(1);
} 