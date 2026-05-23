# Apoio MEI Digital (HTML, CSS e JS)

Projeto migrado para estrutura estatica, sem React/TypeScript.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de producao

```bash
npm run build
npm run preview
```

## Configuracao de pagamento

Antes de publicar, revise `public/site-config.js`.

- `paymentApiPath`: deve apontar para um endpoint do proprio dominio, como `/api/create-payment-session`
- `paymentSessionApiPath`: endpoint `GET` que devolve os dados da sessao para o checkout
- `processPaymentApiPath`: endpoint `POST` que recebe o envio final do Payment Brick
- `checkoutPath`: caminho da pagina hospedada no subdominio `pay.`
- `mercadoPagoPublicKey`: chave publica do Mercado Pago usada no Brick
- `allowedPaymentHosts`: lista de dominios autorizados para abrir o checkout/Pix

O frontend bloqueia links de pagamento fora dessa allowlist.

## Estrutura principal

- `index.html`: marcacao da landing page
- `formulario.js`: envio seguro do formulario e validacao do destino de pagamento
- `checkout.html`: pagina dedicada ao checkout seguro no subdominio `pay.`
- `checkout.js`: inicializacao do Payment Brick e consumo da sessao do backend
- `enviado.js`: validacao do link Pix antes de exibir o botao ao usuario
- `public/site-config.js`: configuracoes publicas do frontend para o fluxo de pagamento
- `styles.css`: estilos globais/responsivos
- `script.js`: interacoes simples (FAQ + ano do rodape)

## Contrato esperado do backend

- `POST /api/create-payment-session`
  - recebe os dados do formulario
  - retorna `{ ok: true, session_id: "abc123" }`
  - opcionalmente pode retornar `checkout_url` ja apontando para `https://pay.apoiomeidigital.com.br/checkout.html?session=abc123`
- `GET /api/payment-session?session=abc123`
  - retorna dados para preencher o resumo e renderizar o Brick
  - campos esperados: `session_id`, `plan_label`, `full_name`, `email`, `amount`, `preference_id`
- `POST /api/process-payment`
  - recebe `session_id`, `selected_payment_method` e `form_data` do Payment Brick
  - processa no backend com Mercado Pago

## Variaveis de ambiente na Netlify

Cadastre estas variaveis no painel da Netlify:

- `MERCADO_PAGO_ACCESS_TOKEN`
  - access token da sua aplicacao Mercado Pago
- `CHECKOUT_SESSION_SECRET`
  - segredo aleatorio usado para assinar a sessao de checkout

As funcoes serverless foram criadas em `netlify/functions/` e o roteamento de `/api/*` esta em `netlify.toml`.
