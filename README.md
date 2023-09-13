# minibox

- O `minibox` foi feito para resolver um problema de organização de *fiados* da vendinha que existe em encontro de jovens com Cristo.
- Funciona em conjunto com o [minibox-api](https://github.com/inolopesm/minibox-api).
- Feito utilizando [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) e [Heroicons](https://heroicons.com/).

## Requisitos mínimos

1. [Node.js](https://nodejs.org/) (Confira a versão no [package.json](./package.json))
1. [npm.js](https://npmjs.com/) (Confira a versão no [package.json](./package.json))

## Instalação

1. Clone o repositório: `git clone git@github.com:inolopesm/minibox.git`
2. Acesse o diretório: `cd minibox`
3. Instale as dependências: `npm install`

## Configuração

### Desenvolvimento

1. Crie o arquivo de configuração: `cp .env.example .env.local`
2. Preencha o `.env.local` com os valores corretos

### Produção

1. Observe as variáveis dentro do `.env.example`
2. Na plataforma de produção configure tais variáveis com os valores corretos

## Usagem

### Desenvolvimento

1. Execute o projeto em modo de desenvolvimento: `npm run dev`

### Produção

1. Construa a versão do projeto para produção: `npm run build`
2. Execute o projeto em modo de produção: `npm start`

## Licença

Este projeto está sob a licença [GPL-3.0](./LICENSE)
