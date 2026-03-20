/**
 * Armazenamento dinâmico de IPs autorizados
 * Este arquivo é lido em tempo real pelo sistema
 */

export const dynamicAuthorizedIps = {
  enabled: true,
  ips: [
    'unknown',  // Localhost IPv4
    '::1',        // Localhost IPv6
  ]
}
