import { users, type User, type InsertUser, type RedactedFile } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRedactedFile(file: {
    id: string;
    originalName: string;
    redactedPath: string;
    stats: {
      names: number;
      phones: number;
      pages: number;
    };
    createdAt: Date;
  }): Promise<RedactedFile>;
  getRedactedFile(id: string): Promise<RedactedFile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private redactedFiles: Map<string, RedactedFile>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.redactedFiles = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createRedactedFile(file: {
    id: string;
    originalName: string;
    redactedPath: string;
    stats: {
      names: number;
      phones: number;
      pages: number;
    };
    createdAt: Date;
  }): Promise<RedactedFile> {
    const redactedFile: RedactedFile = {
      id: file.id,
      originalName: file.originalName,
      redactedPath: file.redactedPath,
      namesCount: file.stats.names,
      phonesCount: file.stats.phones,
      pagesCount: file.stats.pages,
      createdAt: file.createdAt
    };
    
    this.redactedFiles.set(file.id, redactedFile);
    return redactedFile;
  }
  
  async getRedactedFile(id: string): Promise<RedactedFile | undefined> {
    return this.redactedFiles.get(id);
  }
}

export const storage = new MemStorage();
