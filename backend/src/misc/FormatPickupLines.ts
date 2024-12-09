import fs from 'fs-extra';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

interface PickupLine {
  text: string;
  category: string;
}

const categories = [
  'funny', 'clever', 'cheesy', 'nerdy', 'sweet', 
  'casual', 'flirty', 'tech', 'academic', 'outdoor', 
  'foodie', 'dating_app', 'party', 'workplace'
];

function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')         // Normalize spaces
    .replace(/["""]/g, '"')       // Normalize quotes
    .replace(/^["']|["']$/g, '')  // Remove quotes at start/end
    .replace(/\.$/, '')           // Remove trailing periods
    .trim();
}

async function formatPickupLines() {
  try {
    // Read the input file
    const fileContent = await fs.readFile('categorizedlines.csv', 'utf8');
    const lines: PickupLine[] = [];
    
    // Parse the CSV content
    const records = await new Promise<string[][]>((resolve, reject) => {
      parse(fileContent, {
        trim: true,
        delimiter: '\n',
        skip_empty_lines: true,
        relax_column_count: true,
        quote: false,
        escape: false
      }, (err: Error | undefined, records: string[][]) => {
        if (err) reject(err);
        else resolve(records);
      });
    });

    // Process each line
    let currentCategory = '';
    records.forEach((record: string | string[]) => {
      // Join all parts of the record to handle lines with commas
      const line = Array.isArray(record) ? record.join(' ') : String(record);
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;

      // Check if this line is a category header
      if (categories.includes(trimmedLine.toLowerCase())) {
        currentCategory = trimmedLine.toLowerCase();
        return;
      }

      // Add the line with its category
      if (currentCategory && trimmedLine) {
        lines.push({
          text: cleanText(trimmedLine),
          category: currentCategory
        });
      }
    });

    // Format and limit to 50 lines per category
    const formattedLines: PickupLine[] = [];
    categories.forEach(category => {
      const categoryLines = lines
        .filter(line => line.category === category)
        .slice(0, 50)
        .map(line => ({
          text: cleanText(line.text),
          category: category
        }));
      formattedLines.push(...categoryLines);
    });

    // Write to new CSV file
    const output = await new Promise<string>((resolve, reject) => {
      stringify(formattedLines, {
        header: true,
        columns: ['text', 'category']
      }, (err: Error | undefined, output: string) => {
        if (err) reject(err);
        else resolve(output);
      });
    });

    await fs.writeFile('formatted_pickup_lines.csv', output);
    
    // Print statistics
    console.log('\nPickup Lines Statistics:');
    categories.forEach(category => {
      const count = formattedLines.filter(line => line.category === category).length;
      console.log(`${category}: ${count} lines`);
    });
    console.log(`\nTotal: ${formattedLines.length} lines`);

  } catch (error) {
    console.error('Error formatting pickup lines:', error);
  }
}

// Run the script
formatPickupLines(); 