export interface GenericValue<T, V> {
  code: T;
  description: V;
  [propName: string]: any;
}
