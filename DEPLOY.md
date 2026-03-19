# Deploy no GitHub Pages

## Por que dá 404 em `main.tsx`?

O erro **"Failed to load resource: main.tsx 404"** aparece quando o GitHub Pages está a servir o **código-fonte** (branch `main`) em vez do **site buildado** (branch `gh-pages`). O `index.html` do projeto referencia `/src/main.tsx`; esse ficheiro só existe em desenvolvimento. O build gera um `index.html` que referencia `/tiagocosmai/assets/...` (ficheiros que existem na pasta `dist`).

## Passos obrigatórios

### 1. Configurar o GitHub Pages no repositório

No repositório **tiagocosmai** no GitHub:

1. **Settings** → **Pages**
2. Em **Source**: escolher **Deploy from a branch**
3. **Branch**: selecionar **gh-pages** e pasta **/ (root)**
4. Guardar

Assim o site passa a ser o conteúdo da branch **gh-pages** (o build), e não o da `main`.

### 2. Fazer o deploy a partir do projeto

Na pasta do projeto:

```bash
npm run deploy
```

Isto faz o build com o base correto (`/tiagocosmai/`) e envia o conteúdo da pasta `dist` para a branch `gh-pages` do repositório **tiagocosmai**.

### 3. URL do site

Com o repositório **tiagocosmai**, o site fica em:

**https://tiagocosmai.github.io/tiagocosmai/**

---

## Testar o build em local

Para testar o site como fica depois do build, sem publicar:

```bash
npm run deploy   # ou: npm run build:gh
npm run preview  # abre o site em http://localhost:4173
```

Não abras o `index.html` diretamente no browser (ficheiro ou servidor que sirva a raiz do projeto); isso usa o `index.html` de desenvolvimento e dá 404 em `main.tsx`.

---

## Site na raiz (https://tiagocosmai.github.io)

Para o site ficar em **https://tiagocosmai.github.io** (sem `/tiagocosmai/`):

1. Criar um repositório no GitHub com o nome exato **tiagocosmai.github.io**
2. No projeto: `npm run build` (sem `GH_PAGES`) e publicar a pasta `dist` nesse repositório, por exemplo:
   ```bash
   npm run build && gh-pages -d dist -r https://github.com/tiagocosmai/tiagocosmai.github.io.git
   ```
3. No repositório **tiagocosmai.github.io** → Settings → Pages → Source: branch **gh-pages**
