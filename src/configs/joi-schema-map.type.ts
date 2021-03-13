import { BooleanSchema, NumberSchema, StringSchema } from '@hapi/joi';

export type JoiSchemaMap<T> = {
  [key in keyof T]
    : T[key] extends string ? StringSchema
    : T[key] extends number ? NumberSchema
    : T[key] extends boolean ? BooleanSchema
    : never;
};
