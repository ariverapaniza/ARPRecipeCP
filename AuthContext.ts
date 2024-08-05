// AuthContext.ts
import { createContext } from 'react';

export const AuthContext = createContext({
  logStatus: false,
  setLogStatus: (logStatus: boolean) => {}
});
