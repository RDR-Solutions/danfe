/**
 * danfe-to-json: Parse DANFE XML (NFC-e, NFe) into a normalized Danfe object.
 * @see https://github.com/brasizza/danfe-package
 */

import { parseDanfeFromString as parseDanfeFromStringFn } from './parser/index';

export { parseDanfeFromStringFn as parseDanfeFromString };
export type { Danfe as DanfeData, DadosDanfe, TipoDocumento } from './models/index';

/** Use Danfe.parseDanfeFromString(xml). Return type is DanfeData. */
export const Danfe = {
  parseDanfeFromString: parseDanfeFromStringFn,
};
