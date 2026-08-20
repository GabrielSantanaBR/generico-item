# ClientFlow

Sistema demonstrativo de **agendamento, clientes, serviços, orçamentos e atendimento por WhatsApp** para pequenos negócios de serviços.

Pensado para barbearias, salões, estúdios, profissionais autônomos, professores, assistência técnica, estética, fotografia e outros negócios que ainda organizam agenda e atendimento principalmente por mensagens.

## O que a demo entrega

- Dashboard com agenda do dia, receita estimada, clientes e orçamentos;
- agenda com criação e alteração de atendimentos;
- cadastro de clientes;
- catálogo de serviços e preços;
- orçamentos com status e ação de contato;
- modelos de mensagens para confirmação, lembrete e follow-up;
- página pública de agendamento do cliente;
- atalhos de WhatsApp com mensagem pré-preenchida;
- exportação e restauração dos dados da demo;
- persistência local no navegador (`localStorage`);
- layout responsivo para desktop e celular;
- PWA instalável;
- deploy automático no GitHub Pages.

## Objetivo comercial

O repositório funciona como uma base genérica para demonstrar e vender adaptações do sistema. Cada cliente pode receber identidade visual, regras de agenda, serviços, equipe, integrações, pagamentos e automações próprias.

> A versão pública usa armazenamento local para ser demonstrável sem servidor. Uma versão de produção deve substituir essa camada por autenticação e banco persistente (ex.: PostgreSQL/Supabase) e, quando necessário, usar a API oficial do WhatsApp/Meta.

## Estrutura

```text
.
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── sw.js
├── assets/
│   └── icon.svg
├── docs/
│   ├── ARCHITECTURE.md
│   └── COMMERCIAL.md
└── .github/workflows/pages.yml
```

## Rodando localmente

Abra `index.html` diretamente no navegador ou use um servidor estático, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Demo

Os dados iniciais são fictícios. Use **Restaurar demonstração** nas configurações para voltar ao estado original.

## Tecnologias

HTML5, CSS3 e JavaScript sem dependências externas. Isso deixa a demo leve, fácil de publicar e simples de adaptar para diferentes stacks.
