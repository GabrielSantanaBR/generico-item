# Security

## Demo pública

O ClientFlow público é uma demonstração estática. Ele não possui autenticação real, backend, banco remoto ou segredos de produção.

Os dados inseridos na demo ficam no `localStorage` do navegador e podem ser apagados pela própria interface.

## Não usar a demo pública para dados reais

A demonstração não deve armazenar informações reais de clientes, dados sensíveis, prontuários, informações de pagamento ou credenciais.

## Requisitos mínimos para uma implantação comercial

- autenticação no servidor;
- autorização por perfil;
- banco persistente com políticas de acesso;
- HTTPS;
- validação de entrada também no backend;
- proteção e rotação de credenciais;
- backups;
- logs de operações relevantes;
- adequação de retenção e privacidade à operação;
- integração oficial para WhatsApp e pagamentos quando essas automações forem utilizadas.

## Relato de vulnerabilidade

Evite publicar credenciais, tokens ou informações de clientes em issues públicas. Para uma implantação real, o canal de suporte e segurança deve ser definido com o contratante.
