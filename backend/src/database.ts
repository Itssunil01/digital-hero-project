
const db = {
  serialize: (fn: Function) => fn(),

  run: (...args: any[]) => {
    console.log("DB.run called:", args);
  },

  prepare: (query: string) => {
    console.log("DB.prepare:", query);

    return {
      run: (...args: any[]) => {
        console.log("DB.prepare.run:", args);
      },

      get: (...args: any[]) => {
        console.log("DB.prepare.get:", args);
        return null; // simulate no data
      },

      all: (...args: any[]) => {
        console.log("DB.prepare.all:", args);
        return []; // simulate empty list
      },
    };
  },
};

export default db;