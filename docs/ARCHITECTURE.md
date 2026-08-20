# Arquitetura do ClientFlow

## Visão geral

A demonstração pública foi construída sem dependências externas para ser simples de publicar, clonar, testar e personalizar.

### Camadas atuais

1. **Interface** — HTML semântico + CSS responsivo.
2. **Aplicação** — JavaScript responsável por navegação, filtros, formulários e regras da demo.
3. **Persistência** — `localStorage`, usado apenas para a demonstração pública.
4. **Integração externa** — abertura de mensagens no WhatsApp usando `wa.me` com texto pré-preenchido.
5. **PWA** — manifest + service worker para instalação e cache básico.

## Entidades

### Cliente

- nome;
- telefone;
- e-mail;
- observações;
- número de visitas;
- última visita.

### Serviço

- nome;
- duração;
- preço;
- descrição.

### Agendamento

- cliente;
- serviço;
- data;
- horário;
- status.

### Orçamento

- cliente;
- título;
- valor;
- descrição;
- data;
- status.

## Caminho para produção

A versão comercial pode manter a mesma experiência de interface e trocar somente as camadas de persistência e integração.

### Banco e autenticação

Uma implementação comum seria:

- PostgreSQL;
- Supabase Auth ou autenticação própria;
- Row Level Security / regras de acesso;
- perfis de administrador, atendente e profissional;
- backups e trilha de auditoria.

### Agenda por equipe

Adicionar `professional_id` aos serviços e agendamentos permite:

- agenda por profissional;
- horários de trabalho individuais;
- bloqueios e folgas;
- comissão;
- capacidade simultânea.

### WhatsApp

Para automação em produção, usar a API oficial do WhatsApp Business/Meta ou um provedor autorizado. A demo utiliza somente links `wa.me`, sem armazenar tokens e sem automação invisível.

### Pagamentos

Pode ser integrado a gateways que ofereçam PIX/cartão para:

- sinal de reserva;
- pagamento completo;
- confirmação automática;
- política de cancelamento.

## Segurança

A demo não contém segredos, credenciais ou autenticação real. Dados digitados são salvos no navegador do próprio usuário.

Antes de uso com clientes reais:

- adicionar backend autenticado;
- aplicar validação no servidor;
- criptografar transporte via HTTPS;
- proteger dados pessoais;
- definir retenção e backup;
- não expor chaves de APIs no frontend;
- utilizar integrações oficiais para mensageria e pagamentos.
