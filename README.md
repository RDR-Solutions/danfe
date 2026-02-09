# danfe

Parse DANFE XML (NFC-e, NFe) into a normalized **Danfe** object.

Logic is based on [brasizza/danfe-package](https://github.com/brasizza/danfe-package) (Dart).

## Install

```bash
npm install danfe
```

## Usage

```ts
import { parseDanfeFromString } from 'danfe';

const xml = `<?xml version="1.0"?>
<nfeProc>
  <NFe>
    <infNFe>...</infNFe>
  </NFe>
  <protNFe>...</protNFe>
</nfeProc>`;

const danfe = parseDanfeFromString(xml);
if (danfe) {
  console.log(danfe.tipo);       // 'NFCe' | 'NFe'
  console.log(danfe.dados.emit?.xNome);
  console.log(danfe.dados.det);
  // ... use the normalized object
}
```

### API

- **`parseDanfeFromString(xml: string): Danfe | null`**  
  Parses XML and detects type (nfeProc/NFe = NFC-e or NFe). Returns normalized `Danfe` or `null` if invalid or unrecognized.

### Supported XML roots

- **nfeProc** → NFC-e or NFe (from authorized NFe process)
- **NFe** → standalone NFe

## License

ISC
