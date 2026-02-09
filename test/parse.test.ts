import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDanfeFromString } from '../src/index';

const FIXTURES = join(__dirname, 'fixtures');

describe('parseDanfeFromString', () => {
  it('returns null for empty or invalid XML', () => {
    expect(parseDanfeFromString('')).toBeNull();
    expect(parseDanfeFromString('   ')).toBeNull();
    expect(parseDanfeFromString('<x/>')).toBeNull();
    expect(parseDanfeFromString('not xml')).toBeNull();
  });

  it('returns null for CFe (SAT) XML', () => {
    const xml = '<?xml version="1.0"?><CFe><infCFe/></CFe>';
    expect(parseDanfeFromString(xml)).toBeNull();
  });

  it('parses NFC-e (nfeProc) XML and returns Danfe with tipo NFCe', () => {
    const xml = readFileSync(join(FIXTURES, 'sample-nfce.xml'), 'utf-8');
    const danfe = parseDanfeFromString(xml);
    expect(danfe).not.toBeNull();
    expect(danfe!.tipo).toBe('NFCe');
    expect(danfe!.dados.emit?.xNome).toBe('MEU RECIBO LTDA');
    expect(danfe!.dados.ide?.nNF).toBe('5076');
    expect(danfe!.dados.det).toHaveLength(1);
    expect(danfe!.dados.det?.[0].prod?.xProd).toBe('PRODUTO NFC-E 1');
    expect(danfe!.protNFe?.infProt?.nProt).toBe('935206001234567');
  });
});
