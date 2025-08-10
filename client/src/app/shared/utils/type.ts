export type ObjectValues<T> = T[keyof T];

function isObject(o: Record<string, unknown>): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function isPlainObject(o: Record<string, any>): boolean {
  if (isObject(o) === false) {
    return false;
  }

  const ctor = o.constructor;
  if (ctor === undefined) {
    return true;
  }

  const prot = ctor.prototype;
  if (isObject(prot) === false) {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf') === false) {
    return false;
  }

  return true;
}
