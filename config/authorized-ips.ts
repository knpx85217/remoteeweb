/**
 * Configuração de IPs autorizados para acessar o servidor
 * Edite este arquivo para adicionar/remover IPs da whitelist
 */

export const authorizedIpsConfig = {
  enabled: true,
  whitelist: [
    '45.6.223.61',
  ],
  blockMessage: 'Seu IP não está autorizado para acessar este servidor.'
}

export default authorizedIpsConfig
