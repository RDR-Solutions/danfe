import type { TipoDocumento } from './types';
import type { DadosDanfe } from './dados-danfe';
import type { ProtNFe } from './prot-nfe';

export interface Danfe {
  tipo: TipoDocumento;
  dados: DadosDanfe;
  /** QR code content for printing (NFC-e) */
  qrcodePrinter?: string;
  /** Protocol info (NFe) */
  protNFe?: ProtNFe;
  /** URL for consumer to access note (NFC-e) */
  urlConsulta?: string;
}
