import type { Fat } from './fat';
import type { Dup } from './dup';

export interface Cobr {
  fat?: Fat;
  dup?: Dup[];
}
