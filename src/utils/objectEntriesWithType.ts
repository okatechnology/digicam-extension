export const objectEntriesWithType = <T extends object, U extends keyof T>(obj: T) =>
  Object.entries(obj) as (U extends keyof T ? [U, T[U]] : never)[];
