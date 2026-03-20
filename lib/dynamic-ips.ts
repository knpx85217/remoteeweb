/**
 * Armazenamento dinâmico de IPs autorizados
 * Este arquivo é lido em tempo real pelo sistema
 */

export const dynamicAuthorizedIps = {
  enabled: true,
  ips: [
    '45.6.223.61',
    '::1',        // Localhost IPv6
  ]
}
