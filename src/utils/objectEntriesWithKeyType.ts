export const objectEntriesWithKeyType = <T extends object>(obj: T) =>
  Object.entries(obj) as [keyof T, ValueTypeOf<T>][];
