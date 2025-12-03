/**
 * Bug Report Types
 * Типи для системи звітування про баги
 */

export interface BugReport {
  id: string;
  url: string;
  xPos: number; // X coordinate in percentage
  yPos: number; // Y coordinate in percentage
  windowWidth: number;
  windowHeight: number;
  comment: string;
  status: 'new' | 'in_progress' | 'resolved' | 'rejected';
  userId: string;
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt?: string;
  screenshot?: string; // Base64 or URL to screenshot (optional future feature)
  userAgent?: string;
  elementInfo?: {
    tagName: string;
    className: string;
    id: string;
    innerText: string;
  };
}

export interface BugReportFormData {
  comment: string;
}

export interface BugMarkerData {
  bugId: string;
  xPos: number;
  yPos: number;
  comment: string;
  status: string;
  createdAt: string;
  userName: string;
}
