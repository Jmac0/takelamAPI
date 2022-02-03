declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB: string;
      USER: string
      PASSWORD: string
      ; NODE_ENV: 'dev' | 'production';

    }
  }
}


// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}