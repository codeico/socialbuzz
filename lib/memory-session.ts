// In-memory session storage for development (fallback when database tables don't exist)
interface SessionData {
  session_token: string;
  session_type: string;
  session_data: any;
  expires_at: string;
  created_at: string;
}

class MemorySessionStore {
  private sessions: Map<string, SessionData> = new Map();

  // Clean expired sessions periodically
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired sessions every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = new Date();
    const sessionsArray = Array.from(this.sessions.entries());
    for (const [token, session] of sessionsArray) {
      if (new Date(session.expires_at) < now) {
        this.sessions.delete(token);
      }
    }
  }

  async createSession(sessionToken: string, type: string, data: any, expiresAt: string): Promise<void> {
    const sessionData: SessionData = {
      session_token: sessionToken,
      session_type: type,
      session_data: data,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    };

    this.sessions.set(sessionToken, sessionData);
  }

  async getSession(sessionToken: string): Promise<SessionData | null> {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return null;
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      this.sessions.delete(sessionToken);
      return null;
    }

    return session;
  }

  async deleteSession(sessionToken: string): Promise<void> {
    this.sessions.delete(sessionToken);
  }

  // Get stats for debugging
  getStats() {
    return {
      totalSessions: this.sessions.size,
      activeSessions: Array.from(this.sessions.values()).filter(
        session => new Date(session.expires_at) > new Date()
      ).length
    };
  }
}

// Singleton instance
export const memorySessionStore = new MemorySessionStore();