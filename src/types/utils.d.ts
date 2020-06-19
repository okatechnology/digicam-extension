type ValueTypeOf<T extends object> = T extends { [key: string]: infer U } ? U : never;
