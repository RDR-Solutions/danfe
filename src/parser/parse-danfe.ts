import { XMLParser } from 'fast-xml-parser';
import { fromMapNFe } from '../mappers/from-map-nfe';
import type { Danfe } from '../models/danfe';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
});

/**
 * Parse XML string and detect root (nfeProc, NFe), then map to normalized Danfe.
 * Returns null if XML is invalid or not a recognized DANFE type (NFC-e or NFe).
 */
export function parseDanfeFromString(xml: string): Danfe | null {
  if (typeof xml !== 'string' || !xml.trim()) return null;

  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;

  const keys = Object.keys(parsed).filter((k) => !k.startsWith('@'));
  const rootKey = keys.find(
    (k) =>
      k === 'nfeProc' ||
      k === 'nfeproc' ||
      k === 'NFe' ||
      k === 'nfe' ||
      k.endsWith(':nfeProc') ||
      k.endsWith(':NFe')
  );

  if (!rootKey) return null;

  const root = parsed[rootKey];
  if (root == null || typeof root !== 'object') return null;

  const raw = Array.isArray(root) ? root[0] : root;
  if (raw == null || typeof raw !== 'object') return null;
  const rawRecord = raw as Record<string, unknown>;

  if (
    rootKey === 'nfeProc' ||
    rootKey === 'nfeproc' ||
    rootKey.endsWith(':nfeProc')
  ) {
    return fromMapNFe({ nfeProc: rawRecord });
  }

  if (rootKey === 'NFe' || rootKey === 'nfe' || rootKey.endsWith(':NFe')) {
    return fromMapNFe({ NFe: rawRecord });
  }

  return null;
}
