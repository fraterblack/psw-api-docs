export interface DialogClosed<T, A = any, E = any> {
  changed: boolean;
  action?: A;
  data?: T;
  error?: E,
}
