import { dynamicAuthorizedIps } from '@/lib/dynamic-ips'

export class IPWhitelist {
  /**
   * Verifica se um IP está autorizado (lê dinamicamente)
   */
  static isAuthorized(ip: string | null): boolean {
    if (!dynamicAuthorizedIps.enabled) {
      return true // Se desabilitado, permite todos
    }

    if (!ip) {
      return false
    }

    // Normaliza o IP (remove sufixo de porta se houver)
    const cleanIp = ip.split(':')[0]

    return dynamicAuthorizedIps.ips.includes(cleanIp)
  }

  /**
   * Adiciona um IP à lista autorizada
   */
  static addIP(ip: string): void {
    const cleanIp = ip.split(':')[0]
    if (!dynamicAuthorizedIps.ips.includes(cleanIp)) {
      dynamicAuthorizedIps.ips.push(cleanIp)
    }
  }

  /**
   * Remove um IP da lista autorizada
   */
  static removeIP(ip: string): void {
    const cleanIp = ip.split(':')[0]
    dynamicAuthorizedIps.ips = dynamicAuthorizedIps.ips.filter(item => item !== cleanIp)
  }

  /**
   * Retorna a lista de IPs autorizados
   */
  static getWhitelist(): string[] {
    return dynamicAuthorizedIps.ips
  }

  /**
   * Habilita/desabilita o whitelist
   */
  static setEnabled(enabled: boolean): void {
    dynamicAuthorizedIps.enabled = enabled
  }

  /**
   * Retorna se o whitelist está habilitado
   */
  static isEnabled(): boolean {
    return dynamicAuthorizedIps.enabled
  }
}
