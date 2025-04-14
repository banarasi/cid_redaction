export type ProcessingStage = 
  | "Analyzing text"
  | "Identifying sensitive data"
  | "Applying redactions"
  | "Finalizing document";

export interface RedactionStats {
  names: number;
  phones: number;
  pages: number;
}

export interface RedactedFile {
  id: string;
  originalName: string;
  redactedPath: string;
  stats: RedactionStats;
  createdAt: Date;
}
