# danfe

Parse DANFE XML (NFC-e, NFe) into a normalized **Danfe** object.

Logic is based on [brasizza/danfe-package](https://github.com/brasizza/danfe-package) (Dart).

## Install

```bash
npm install danfe
```

## Usage

```ts
import { Danfe } from 'danfe';

const xml = `<?xml version="1.0"?>
<nfeProc>
  <NFe>
    <infNFe>...</infNFe>
  </NFe>
  <protNFe>...</protNFe>
</nfeProc>`;

const danfe = Danfe.parseDanfeFromString(xml);
if (danfe) {
  console.log(danfe.tipo);       // 'NFCe' | 'NFe'
  console.log(danfe.dados.emit?.xNome);
  console.log(danfe.dados.det);
  // ... use the normalized object
}
```

You can also use the function directly: `import { parseDanfeFromString } from 'danfe'`.

### API

- **`Danfe.parseDanfeFromString(xml: string): DanfeData | null`**  
  Parses XML and detects type (nfeProc/NFe = NFC-e or NFe). Returns normalized `DanfeData` or `null` if invalid or unrecognized. Import the type as `import type { DanfeData } from 'danfe'` if needed.

### Supported XML roots

- **nfeProc** → NFC-e or NFe (from authorized NFe process)
- **NFe** → standalone NFe

## License

ISC
