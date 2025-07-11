import { User } from '../../models/user'; // adjust if needed

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {}; // ✅ required
