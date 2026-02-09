import type { Emit } from './emit';
import type { Dest } from './dest';
import type { Ide } from './ide';
import type { Det } from './det';
import type { Total } from './total';
import type { Pgto } from './pgto';
import type { InfAdic } from './inf-adic';
import type { Transp } from './transp';
import type { Cobr } from './cobr';

export interface DadosDanfe {
  emit?: Emit;
  dest?: Dest;
  ide?: Ide;
  det?: Det[];
  total?: Total;
  pgto?: Pgto;
  chaveNota?: string;
  infAdic?: InfAdic;
  transp?: Transp;
  cobr?: Cobr;
}
