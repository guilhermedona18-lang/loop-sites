# Loop Sites na Render

- `catalogo`: vitrine pública; `/dash` exige a senha administrativa.
- `consulta`: consulta e download de contratos com CPF e código.

Os serviços executam Next.js em Node.js na Render. Os dados e PDFs existentes continuam no Cloudflare D1/R2. O catálogo acessa esse armazenamento via endpoint autenticado, exclusivamente no servidor. O serviço original precisa permanecer ativo enquanto o armazenamento for utilizado.

Use plano Free para os dois serviços. Não crie banco temporário nem disco local para contratos. As duas instâncias compartilham a franquia gratuita da conta Render e podem hibernar após inatividade.

Catálogo: build `cd catalogo && npm ci && npm run build`; start `cd catalogo && npm start`.
Consulta: build `cd consulta && npm ci && npm run build`; start `cd consulta && npm start`.

Segredos são configurados apenas na Render. Consulte `.env.example` em cada aplicativo. Nunca coloque senhas ou chaves neste repositório.
