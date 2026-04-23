// src/database.ts

// ✅ Force TypeScript to ignore strict typing
const db: any = {
  serialize: (fn: Function) => fn(),

  run: (...args: any[]) => {
    console.log("DB.run:", args);
  },

  get: (...args: any[]) => {
    console.log("DB.get:", args);
    return null;
  },

  all: (...args: any[]) => {
    console.log("DB.all:", args);
    return [];
  },

  prepare: (query: string) => {
    console.log("DB.prepare:", query);

    return {
      run: (...args: any[]) => {
        console.log("DB.prepare.run:", args);
      },
      get: (...args: any[]) => {
        console.log("DB.prepare.get:", args);
        return null;
      },
      all: (...args: any[]) => {
        console.log("DB.prepare.all:", args);
        return [];
      },
    };
  },
};

export default db;