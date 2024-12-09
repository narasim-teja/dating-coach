import fs from 'fs-extra';
import { parse } from 'csv-parse';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

interface PickupLine {
  text: string;
  category: string;
}

async function readFormattedCSV(): Promise<PickupLine[]> {
  const fileContent = await fs.readFile('formatted_pickup_lines.csv', 'utf8');
  return new Promise((resolve, reject) => {
    parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }, (err, records: PickupLine[]) => {
      if (err) reject(err);
      else resolve(records);
    });
  });
}

async function generateEmbedding(text: string): Promise<number[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

async function uploadToPinecone() {
  try {
    console.log('Reading formatted pickup lines...');
    const pickupLines = await readFormattedCSV();
    console.log(`Found ${pickupLines.length} lines to process`);

    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || ''
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'pickup-lines';
    const index = pinecone.index(indexName);

    // Process in batches
    const batchSize = 50;
    const totalBatches = Math.ceil(pickupLines.length / batchSize);

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const start = batchNum * batchSize;
      const end = start + batchSize;
      const batch = pickupLines.slice(start, end);

      console.log(`\nProcessing batch ${batchNum + 1}/${totalBatches}`);
      
      // Generate embeddings for the batch
      const vectors = await Promise.all(
        batch.map(async (line, i) => {
          const embedding = await generateEmbedding(line.text);
          console.log(`Generated embedding for line ${start + i + 1}/${pickupLines.length}`);
          
          return {
            id: `line-${start + i}`,
            values: embedding,
            metadata: {
              text: line.text,
              category: line.category
            }
          };
        })
      );

      // Upload batch to Pinecone
      console.log(`Uploading batch ${batchNum + 1} to Pinecone...`);
      await index.upsert(vectors);
      
      // Optional: Add delay between batches to avoid rate limits
      if (batchNum < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\nUpload completed successfully!');
    
    // Print statistics
    const stats = pickupLines.reduce((acc, line) => {
      acc[line.category] = (acc[line.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nUploaded lines by category:');
    Object.entries(stats).forEach(([category, count]) => {
      console.log(`${category}: ${count} lines`);
    });
    console.log(`Total: ${pickupLines.length} lines`);

  } catch (error) {
    console.error('Error uploading to Pinecone:', error);
  }
}

// Run the upload
uploadToPinecone(); 