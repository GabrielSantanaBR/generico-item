# ClientFlow

Sistema demonstrativo de **agendamento, clientes, serviços, orçamentos e atendimento por WhatsApp** para pequenos negócios de serviços.

Pensado para barbearias, salões, estúdios, profissionais autônomos, professores, assistência técnica, estética, fotografia e outros negócios que ainda organizam agenda e atendimento principalmente por mensagens.

## Proposta

O ClientFlow foi construído como um **produto demonstrável e adaptável**, não como uma tela estática de portfólio. A pessoa pode cadastrar clientes e serviços, criar atendimentos e orçamentos, montar mensagens e testar uma página pública de agendamento.

## O que a demo entrega

- Dashboard com agenda do dia, receita estimada, clientes e orçamentos;
- agenda com criação, edição e status de atendimentos;
- cadastro de clientes;
- catálogo de serviços, duração e preço;
- orçamentos com status e ação de contato;
- modelos de mensagens para confirmação, lembrete e follow-up;
- página pública de agendamento do cliente;
- atalhos de WhatsApp com mensagem pré-preenchida;
- exportação e restauração dos dados da demo;
- persistência local no navegador (`localStorage`);
- layout responsivo para desktop e celular;
- PWA instalável;
- deploy automático no GitHub Pages;
- workflow de verificação de sintaxe e arquivos obrigatórios.

## Objetivo comercial

O repositório funciona como uma base genérica para demonstrar e vender adaptações do sistema. Cada cliente pode receber identidade visual, regras de agenda, serviços, equipe, integrações, pagamentos e automações próprias.

Uma demonstração de venda pode seguir este fluxo:

1. abrir a página pública de agendamento;
2. solicitar um horário como cliente;
3. voltar ao painel e mostrar o atendimento na agenda;
4. abrir o cadastro do cliente;
5. criar um orçamento;
6. montar uma mensagem e abrir o WhatsApp.

> A versão pública usa armazenamento local para ser demonstrável sem servidor. Uma versão de produção deve substituir essa camada por autenticação e banco persistente e usar integrações oficiais quando houver automação de WhatsApp ou pagamentos.

## Publicação da demo

O workflow de GitHub Pages já está em `.github/workflows/pages.yml`.

Depois de ativar **Settings → Pages → Source: GitHub Actions**, a URL esperada é:

`https://gabrielsantanabr.github.io/generico-item/`

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
├── SECURITY.md
├── LICENSE.md
└── .github/workflows/
    ├── pages.yml
    └── quality.yml
```

## Rodando localmente

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Dados da demonstração

Todos os nomes, valores e contatos iniciais são fictícios. Use **Restaurar demonstração** nas configurações para voltar ao estado original.

Não use a versão pública para dados reais de clientes.

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): arquitetura atual e caminho para produção.
- [`docs/COMMERCIAL.md`](docs/COMMERCIAL.md): posicionamento, nichos e roteiro de demonstração.
- [`SECURITY.md`](SECURITY.md): limites de segurança da versão pública.

## Tecnologias

HTML5, CSS3 e JavaScript sem dependências externas. Isso deixa a demonstração leve, rápida, simples de publicar e fácil de adaptar para stacks com backend real.
