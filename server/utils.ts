import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { RedactionStats } from "@/types";

/**
 * Process PDF file using the Python script
 */
export async function processFile(inputPath: string, outputPath: string): Promise<{
  success: boolean;
  error?: string;
  stats: RedactionStats;
}> {
  // Construct the path to the Python script
  const scriptPath = path.join(process.cwd(), "server", "pdf-processor.py");
  
  return new Promise((resolve) => {
    // Execute the Python script
    exec(`python ${scriptPath} "${inputPath}" "${outputPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error.message}`);
        return resolve({
          success: false,
          error: `Execution error: ${error.message}`,
          stats: { names: 0, phones: 0, pages: 0 }
        });
      }
      
      if (stderr) {
        console.error(`Python error: ${stderr}`);
        return resolve({
          success: false,
          error: `Python error: ${stderr}`,
          stats: { names: 0, phones: 0, pages: 0 }
        });
      }
      
      try {
        // Parse the output from the Python script
        const result = JSON.parse(stdout.trim());
        
        return resolve({
          success: true,
          stats: {
            names: result.names_count || 0,
            phones: result.phones_count || 0,
            pages: result.pages_count || 0
          }
        });
      } catch (parseError) {
        console.error(`Failed to parse Python output: ${parseError}`);
        return resolve({
          success: false,
          error: `Failed to parse Python output: ${parseError}`,
          stats: { names: 0, phones: 0, pages: 0 }
        });
      }
    });
  });
}

/**
 * Generate a unique ID for files
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

/**
 * Clean up files older than 24 hours
 */
export function cleanupOldFiles(): void {
  const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();
  
  const tempDirs = [
    path.join(process.cwd(), "temp", "uploads"),
    path.join(process.cwd(), "temp", "redacted")
  ];
  
  for (const dir of tempDirs) {
    if (!fs.existsSync(dir)) continue;
    
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        // If file is older than MAX_AGE_MS, delete it
        if (now - stats.mtime.getTime() > MAX_AGE_MS) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up old file: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up directory ${dir}:`, error);
    }
  }
}
