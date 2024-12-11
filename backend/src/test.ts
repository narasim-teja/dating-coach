import { runTest } from './scripts/chatbot/testScript';

console.log('Starting chatbot test...');
runTest().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
}); 