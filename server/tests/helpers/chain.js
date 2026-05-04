import { jest } from '@jest/globals';

// Crea un mock estilo "query de Mongoose": cualquier método (.populate, .sort,
// .select, .lean, ...) devuelve la misma cadena, y `await chain` resuelve al
// valor final.
export const chainable = (value) => {
  const promise = Promise.resolve(value);
  const handler = {
    get(_target, prop) {
      if (prop === 'then') return promise.then.bind(promise);
      if (prop === 'catch') return promise.catch.bind(promise);
      if (prop === 'finally') return promise.finally.bind(promise);
      return jest.fn().mockReturnValue(proxy);
    },
  };
  const proxy = new Proxy({}, handler);
  return proxy;
};

export const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
