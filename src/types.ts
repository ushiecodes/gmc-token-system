export enum UserRole {
    Counter = "counter",
    Admin = "admin",
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
}

export enum TokenCategory {
  General = "General",
  SeniorCitizen = "Senior Citizen",
  Referral = "Referral",
}

export enum TokenStatus {
  Waiting = "Waiting",
  Called = "Called",
  Finished = "Finished",
}

export enum TokenType {
  Digital = "Digital",
  WalkIn = "Walk-in",
}

export interface Token {
  id: string;
  tokenNumber: string;
  tokenPrefix: "G" | "W";
  numericPart: number;
  casePaperId: string;
  department: string;
  generatedAt: number; // Stored as timestamp
  category: TokenCategory;
  status: TokenStatus;
  type: TokenType;
}

export interface DisplayToken {
  id: string;
  tokenNumber: string;
  department: string;
  category: TokenCategory;
  status: TokenStatus;
}