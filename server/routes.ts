import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processFile, generateUniqueId, cleanupOldFiles } from "./utils";

// Configure file uploads
const upload = multer({
  dest: path.join(process.cwd(), "temp", "uploads"),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

// Ensure temp directories exist
const ensureTempDirs = () => {
  const dirs = [
    path.join(process.cwd(), "temp", "uploads"),
    path.join(process.cwd(), "temp", "redacted")
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize temp directories
  ensureTempDirs();
  
  // Schedule cleanup of old files every hour
  setInterval(cleanupOldFiles, 60 * 60 * 1000);
  
  // PDF upload endpoint
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const inputPath = req.file.path;
      const uniqueId = generateUniqueId();
      const outputPath = path.join(process.cwd(), "temp", "redacted", `${uniqueId}.pdf`);
      
      console.log(`Processing file: ${inputPath}`);
      console.log(`Output will be saved to: ${outputPath}`);
      
      // Process the PDF file (redact sensitive information)
      const result = await processFile(inputPath, outputPath);
      
      if (!result.success) {
        return res.status(500).json({ message: result.error || "Failed to process PDF" });
      }
      
      // Store file information
      const redactedFile = await storage.createRedactedFile({
        id: uniqueId,
        originalName: req.file.originalname,
        redactedPath: outputPath,
        stats: result.stats,
        createdAt: new Date()
      });
      
      return res.json({
        redacted_filename: redactedFile.id,
        stats: {
          names: redactedFile.namesCount,
          phones: redactedFile.phonesCount,
          pages: redactedFile.pagesCount
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: error instanceof Error ? error.message : "Failed to process file" });
    }
  });
  
  // Download redacted PDF endpoint
  app.get("/api/download/:fileId", async (req, res) => {
    try {
      const fileId = req.params.fileId;
      
      // Get file information from storage
      const redactedFile = await storage.getRedactedFile(fileId);
      
      if (!redactedFile) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Check if file exists
      if (!fs.existsSync(redactedFile.redactedPath)) {
        return res.status(404).json({ message: "Redacted file not found on disk" });
      }
      
      // Create download filename
      const downloadName = redactedFile.originalName.replace(/\.pdf$/i, "-redacted.pdf");
      
      // Send the file
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);
      
      const fileStream = fs.createReadStream(redactedFile.redactedPath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Download error:", error);
      return res.status(500).json({ message: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
