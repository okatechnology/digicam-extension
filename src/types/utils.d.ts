interface ObjectConstructor {
  entries<T extends object>(obj: T): { [K in keyof T]: [K, T[K]] }[keyof T][];
}
