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

- `paymentApiPath`: deve apontar para um endpoint do proprio dominio, como `/api/create-payment`
- `allowedPaymentHosts`: lista de dominios autorizados para abrir o checkout/Pix

O frontend bloqueia links de pagamento fora dessa allowlist.

## Estrutura principal

- `index.html`: marcacao da landing page
- `formulario.js`: envio seguro do formulario e validacao do destino de pagamento
- `enviado.js`: validacao do link Pix antes de exibir o botao ao usuario
- `public/site-config.js`: configuracoes publicas do frontend para o fluxo de pagamento
- `styles.css`: estilos globais/responsivos
- `script.js`: interacoes simples (FAQ + ano do rodape)
