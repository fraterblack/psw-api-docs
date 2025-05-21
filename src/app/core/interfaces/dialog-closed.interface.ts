export interface DialogClosed<T, A = any, E = any> {
  changed: boolean;
  action?: A;
  object?: T;
  error?: E,
}
