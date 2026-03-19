# Formulário de contato (Resend)

A **API key do Resend nunca vai para o browser**. O frontend só chama `POST /api/contact`; o servidor é que chama `api.resend.com`.

## Variáveis de ambiente

Copia `.env.example` para `.env` e preenche:

| Variável | Descrição |
|----------|-----------|
| `RESEND_API_KEY` | Chave `re_...` no [Resend](https://resend.com) |
| `RESEND_FROM` | Remetente verificado, ex. `Portfolio <onboarding@resend.dev>` ou o teu domínio |
| `CONTACT_TO` | Email onde queres receber as mensagens |

## Desenvolvimento local

1. `npm run dev:all` — sobe o Vite **e** a API na porta `8787` (proxy `/api/contact` → API).
2. Ou dois terminais: `npm run dev` + `npm run dev:api`.

Sem API a correr, o envio falha com erro de rede (esperado).

## Deploy

### Vercel (recomendado: site + API no mesmo projeto)

1. Faz deploy do repositório na Vercel.
2. Nas **Environment Variables**, define `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO`.
3. A função `api/contact.ts` fica disponível em `https://teu-dominio.vercel.app/api/contact`.
4. **Não** precisas de `VITE_CONTACT_API_URL` se o frontend e a API forem o mesmo domínio.

### GitHub Pages (só estático)

O `dist/` não inclui servidor. Opções:

- Define no build: `VITE_CONTACT_API_URL=https://teu-projeto.vercel.app/api/contact` (API noutro deploy Vercel/Railway), **ou**
- Hospeda o `server/` noutro serviço (Railway, Fly.io, etc.) e usa essa URL em `VITE_CONTACT_API_URL`.

## Resend

- Em testes, `onboarding@resend.dev` só envia para o email da conta Resend.
- Para produção, verifica o teu domínio em Resend e usa `RESEND_FROM` com esse domínio.
