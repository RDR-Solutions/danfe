import type { Danfe } from '../models/danfe';
import type { DadosDanfe } from '../models/dados-danfe';
import type { Emit } from '../models/emit';
import type { EnderEmit } from '../models/ender-emit';
import type { Dest } from '../models/dest';
import type { Ide } from '../models/ide';
import type { Det } from '../models/det';
import type { Prod } from '../models/prod';
import type { Total } from '../models/total';
import type { Pgto } from '../models/pgto';
import type { MP } from '../models/mp';
import type { InfAdic } from '../models/inf-adic';
import type { Transp } from '../models/transp';
import type { Cobr } from '../models/cobr';
import type { ProtNFe } from '../models/prot-nfe';
import type { InfProt } from '../models/inf-prot';
import { first, asArray, nodeText } from '../parser/xml-utils';

type Raw = Record<string, unknown>;

function text(n: unknown): string {
  return nodeText(n) || '';
}

function num(n: unknown): string {
  const s = text(n);
  return s === '' ? '0' : s;
}

/** Map nfeProc or standalone NFe to Danfe (NFC-e or NFe) */
export function fromMapNFe(root: Raw): Danfe | null {
  let nfeBlock: Raw | undefined;
  let protNFeBlock: Raw | undefined;

  if (root['nfeProc'] != null) {
    const nfeProc = first(root['nfeProc']) as Raw | undefined;
    if (nfeProc && typeof nfeProc === 'object') {
      nfeBlock = first(nfeProc['NFe'] ?? nfeProc['nfe']) as Raw | undefined;
      protNFeBlock = first(nfeProc['protNFe'] ?? nfeProc['protnfe']) as Raw | undefined;
    }
  } else if (root['NFe'] != null || root['nfe'] != null) {
    nfeBlock = first(root['NFe'] ?? root['nfe']) as Raw | undefined;
  }

  if (!nfeBlock || typeof nfeBlock !== 'object') return null;

  const infNFe = first(nfeBlock['infNFe'] ?? nfeBlock['infnfe']) as Raw | undefined;
  if (!infNFe || typeof infNFe !== 'object') return null;

  const ide = first(infNFe['ide']) as Raw | undefined;
  const tpNF = text(ide?.['tpNF'] ?? ide?.['tpNF']);
  const tipo: 'NFCe' | 'NFe' = tpNF === '1' ? 'NFCe' : 'NFe';

  const emit = buildEmitNFe(infNFe);
  const dest = buildDestNFe(infNFe);
  const ideMapped = buildIdeNFe(infNFe);
  const det = buildDetNFe(infNFe);
  const total = buildTotalNFe(infNFe);
  const pgto = buildPgtoNFe(infNFe);
  const infAdic = buildInfAdicNFe(infNFe);
  const transp = buildTranspNFe(infNFe);
  const cobr = buildCobrNFe(infNFe);

  let chaveNota: string | undefined;
  const idAttr = infNFe['@_Id'] ?? infNFe['@_id'];
  if (idAttr != null) {
    chaveNota = String(idAttr).replace(/^NFe/, '');
  }

  const protNFe = buildProtNFe(protNFeBlock);

  const dados: DadosDanfe = {
    emit,
    dest,
    ide: ideMapped,
    det,
    total,
    pgto,
    chaveNota,
    infAdic: Object.keys(infAdic).length ? infAdic : undefined,
    transp: transp.transporta ? transp : undefined,
    cobr: cobr.fat || (cobr.dup && cobr.dup.length > 0) ? cobr : undefined,
  };

  // infNFeSupl é irmão de infNFe dentro de NFe (nfeBlock), não filho de infNFe
  const supl = first(nfeBlock['infNFeSupl'] ?? nfeBlock['infnfesupl']) as Raw | undefined;
  let qrcodePrinter = '';
  let urlConsulta: string | undefined;
  if (supl && typeof supl === 'object') {
    qrcodePrinter = text(supl['qrCode'] ?? supl['qrCod'] ?? supl['qrcode']) || text(supl['urlChave']);
    urlConsulta = text(supl['urlChave']).trim() || undefined;
  }

  return {
    tipo,
    dados,
    qrcodePrinter: qrcodePrinter || undefined,
    urlConsulta: urlConsulta || undefined,
    protNFe: protNFe.infProt ? protNFe : undefined,
  };
}

function buildEmitNFe(inf: Raw): Emit {
  const emitRaw = first(inf['emit']) as Raw | undefined;
  if (!emitRaw || typeof emitRaw !== 'object') return {};

  const ender = first(emitRaw['enderEmit'] ?? emitRaw['ender']) as Raw | undefined;
  const enderEmit: EnderEmit | undefined = ender
    ? {
        xLgr: text(ender['xLgr']).trim() || undefined,
        nro: text(ender['nro']).trim() || undefined,
        xBairro: text(ender['xBairro']).trim() || undefined,
        cMun: text(ender['cMun']).trim() || undefined,
        uF: text(ender['UF'] ?? ender['uF']).trim() || undefined,
        cEP: text(ender['CEP'] ?? ender['cEP']).trim() || undefined,
      }
    : undefined;

  return {
    CNPJ: text(emitRaw['CNPJ']).trim() || undefined,
    xNome: text(emitRaw['xNome']).trim() || undefined,
    xFant: text(emitRaw['xFant']).trim() || undefined,
    enderEmit,
  };
}

function buildDestNFe(inf: Raw): Dest {
  const destRaw = first(inf['dest']) as Raw | undefined;
  if (!destRaw || typeof destRaw !== 'object') return {};

  return {
    CPF: text(destRaw['CPF']).trim() || undefined,
    CNPJ: text(destRaw['CNPJ']).trim() || undefined,
    xNome: text(destRaw['xNome']).trim() || undefined,
  };
}

function buildIdeNFe(inf: Raw): Ide {
  const ideRaw = first(inf['ide']) as Raw | undefined;
  if (!ideRaw || typeof ideRaw !== 'object') return {};

  return {
    nNF: text(ideRaw['nNF']).trim() || undefined,
    serie: text(ideRaw['serie'] ?? ideRaw['cSerie']).trim() || undefined,
    dEmi: text(ideRaw['dEmi']).trim() || undefined,
    dhEmi: text(ideRaw['dhEmi'] ?? ideRaw['dEmi']).trim() || undefined,
    dhSaiEnt: text(ideRaw['dhSaiEnt']).trim() || undefined,
  };
}

function buildDetNFe(inf: Raw): Det[] {
  const detList = asArray(inf['det']);
  const out: Det[] = [];

  for (const d of detList) {
    const detObj = typeof d === 'object' && d !== null ? (d as Raw) : {};
    const prodRaw = first(detObj['prod']) as Raw | undefined;
    if (!prodRaw || typeof prodRaw !== 'object') continue;

    const prod: Prod = {
      cProd: text(prodRaw['cProd']).trim() || undefined,
      xProd: text(prodRaw['xProd']).trim() || undefined,
      qCom: num(prodRaw['qCom']),
      vUnCom: num(prodRaw['vUnCom']),
      vProd: num(prodRaw['vProd']),
    };
    out.push({ prod });
  }
  return out;
}

function buildTotalNFe(inf: Raw): Total {
  const totalRaw = first(inf['total']) as Raw | undefined;
  if (!totalRaw || typeof totalRaw !== 'object')
    return { valorTotal: '0', valorPago: '0', valorFrete: '0.00', desconto: '0.00', acrescimo: '0.00' };

  const icms = first(totalRaw['ICMSTot'] ?? totalRaw['ICMSTot']) as Raw | undefined;
  const vNF = icms ? num(icms['vNF']) : num(totalRaw['vNF']);
  const vProd = icms ? num(icms['vProd']) : num(totalRaw['vProd']);
  const vDesc = icms ? num(icms['vDesc']) : num(totalRaw['vDesc']);
  const vFrete = icms ? num(icms['vFrete']) : num(totalRaw['vFrete']);
  const vOutro = icms ? num(icms['vOutro']) : num(totalRaw['vOutro']);
  const vTotTrib = icms ? text(icms['vTotTrib']) : text(totalRaw['vTotTrib']);

  return {
    vNF,
    valorTotal: vProd,
    valorPago: vNF,
    desconto: vDesc,
    valorFrete: vFrete,
    acrescimo: vOutro,
    valotTotalTributos: vTotTrib.trim() || undefined,
  };
}

function buildPgtoNFe(inf: Raw): Pgto | undefined {
  const pgtoRaw = first(inf['pgto']) as Raw | undefined;
  if (!pgtoRaw || typeof pgtoRaw !== 'object') return undefined;

  const detPagList = asArray(pgtoRaw['det'] ?? pgtoRaw['detPag']);
  const formas: MP[] = [];

  for (const d of detPagList) {
    const mo = typeof d === 'object' && d !== null ? (d as Raw) : {};
    const cMP = text(mo['indPag'] ?? mo['tPag'] ?? mo['cMP']).trim();
    const vMP = num(mo['vPag'] ?? mo['vMP']);
    if (cMP || vMP) formas.push({ cMP: cMP || undefined, vMP });
  }

  const vTroco = num(pgtoRaw['vTroco']);
  return { formas, vTroco: vTroco !== '0' ? vTroco : undefined };
}

function buildInfAdicNFe(inf: Raw): InfAdic {
  const adic = first(inf['infAdic']) as Raw | undefined;
  if (!adic || typeof adic !== 'object') return {};
  const infCpl = text(adic['infCpl']).trim();
  return infCpl ? { infCpl } : {};
}

function buildTranspNFe(inf: Raw): Transp {
  const transpRaw = first(inf['transp']) as Raw | undefined;
  if (!transpRaw || typeof transpRaw !== 'object') return {};
  const transporta = first(transpRaw['transporta']) as Raw | undefined;
  if (!transporta || typeof transporta !== 'object') return {};
  return {
    transporta: {
      xNome: text(transporta['xNome']).trim() || undefined,
      xEnder: text(transporta['xEnder']).trim() || undefined,
      xMun: text(transporta['xMun']).trim() || undefined,
      uf: text(transporta['UF'] ?? transporta['uf']).trim() || undefined,
    },
  };
}

function buildCobrNFe(inf: Raw): Cobr {
  const cobrRaw = first(inf['cobr']) as Raw | undefined;
  if (!cobrRaw || typeof cobrRaw !== 'object') return {};

  const fat = first(cobrRaw['fat']) as Raw | undefined;
  const dupList = asArray(cobrRaw['dup']);
  const dup = dupList.map((d) => {
    const o = typeof d === 'object' && d !== null ? (d as Raw) : {};
    return {
      nDup: text(o['nDup']).trim() || undefined,
      dVenc: text(o['dVenc']).trim() || undefined,
      vDup: num(o['vDup']),
    };
  });

  return {
    fat: fat
      ? {
          nFat: text(fat['nFat']).trim() || undefined,
          vOrig: num(fat['vOrig']),
          vLiq: num(fat['vLiq']),
        }
      : undefined,
    dup: dup.length ? dup : undefined,
  };
}

function buildProtNFe(protBlock: Raw | undefined): ProtNFe {
  if (!protBlock || typeof protBlock !== 'object') return {};
  const infProt = first(protBlock['infProt']) as Raw | undefined;
  if (!infProt || typeof infProt !== 'object') return {};
  const inf: InfProt = {
    nProt: text(infProt['nProt']).trim() || undefined,
    dhRecbto: text(infProt['dhRecbto']).trim() || undefined,
  };
  return inf.nProt || inf.dhRecbto ? { infProt: inf } : {};
}
