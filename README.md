# API PIX - Automação de Testes

Esta API permite registro e login de usuários, consulta de saldo, extrato e realização de transações PIX (pagamento e recebimento). O banco de dados é em memória, ideal para aprendizado de testes automatizados.

## Funcionalidades
- Registro de usuário (com validação de duplicidade e chave PIX única)
- Login de usuário
- Consulta de saldo
- Consulta de extrato dos últimos 30 dias
- Pagamento PIX (com validação de saldo, limite de 10 transações/hora)
- Recebimento PIX (com validação de chave PIX e limite de 10 transações/hora)
- Documentação Swagger disponível em `/api-docs`

## Instalação
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install express swagger-ui-express
   ```

## Execução
- Para iniciar o servidor:
  ```bash
  node server.js
  ```
- Para importar o app em testes:
  ```js
  const app = require('./app');
  ```

## Endpoints principais
- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login
- `GET /users/balance` — Consulta de saldo
- `GET /users/statement` — Consulta de extrato
- `POST /pix/pay` — Pagamento PIX
- `POST /pix/receive` — Recebimento PIX
- `GET /api-docs` — Documentação Swagger

## Observações
- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
- Limite de 10 transações PIX por hora por usuário.
- O extrato retorna apenas transações dos últimos 30 dias.
- Chaves PIX duplicadas são rejeitadas no cadastro.

## Testes
- Recomenda-se o uso do [Supertest](https://github.com/visionmedia/supertest) para automação dos testes de API.
