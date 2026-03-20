"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Settings, Zap, Target } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"
import { useNotifications } from "@/contexts/notification-context"
import { sendQueueCommand } from "@/lib/exe-proxy"

export function AimCategory() {
  const [activeTab, setActiveTab] = useState("rage")
  const [loadingCommand, setLoadingCommand] = useState<string | null>(null)
  const { state, updateAim, setLoaded } = useAppContext()
  const { addNotification } = useNotifications()

  const handleLoad = async (type: 'rage' | 'legit') => {
    try {
      setLoadingCommand(type)
      const featureName = type === 'rage' ? 'rage_aim' : 'legit_aim'
      
      const commandId = await sendQueueCommand(featureName as any, 'activate')
      
      if (commandId) {
        setLoaded(type, true)
        updateAim(type, 'enabled', true)
        
        addNotification({
          type: 'success',
          title: `${type.toUpperCase()} CARREGADO`,
          message: `Comando enviado para o .exe`
        })
      } else {
        throw new Error('Falha ao enviar comando')
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: `Erro ao carregar ${type.toUpperCase()}`,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setLoadingCommand(null)
    }
  }

  const handleSettingChange = async (category: keyof typeof state.aim, key: string, value: any) => {
    if (key === 'enabled' && (category === 'rage' || category === 'legit')) {
      try {
        const featureName = category === 'rage' ? 'rage_aim' : 'legit_aim'
        
        const commandId = await sendQueueCommand(
          featureName as any,
          value ? 'activate' : 'deactivate'
        )
        
        if (commandId) {
          updateAim(category, key, value)
          
          if (value) {
            addNotification({
              type: 'success',
              title: `${category.toUpperCase()} ATIVADO`,
              message: ``
            })
          } else {
            addNotification({
              type: 'info',
              title: `${category.toUpperCase()} DESATIVADO`,
              message: ``
            })
            updateAim(category, 'keybind', '')
            updateAim(category, 'keybindEnabled', false)
          }
        } else {
          throw new Error('Falha ao enviar comando')
        }
      } catch (error) {
        addNotification({
          type: 'error',
          title: `Erro ao atualizar ${category.toUpperCase()}`,
          message: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    } else if (key === 'keybind' || key === 'keybindType') {
      updateAim(category, key, value)
      
      if (key === 'keybind') {
        addNotification({
          type: 'info',
          title: `Keybind configurado: ${value}`,
          message: ``
        })
      }
    } else {
      updateAim(category, key, value)
    }
  }

  const handleMiscChange = async (key: string, value: boolean) => {
    updateAim('misc', key, value)
      
    const functionNames = {
      'precision': 'PRECISION',
      'headshot': 'HS PESCOÇO'
    }

    const featureMap: { [key: string]: string } = {
      'precision': 'precision',
      'headshot': 'headshot'
    }

    const featureName = featureMap[key]

    try {
      const commandId = await sendQueueCommand(featureName as any, value ? 'activate' : 'deactivate')
      
      if (commandId) {
        if (value) {
          addNotification({
            type: 'success',
            title: `${functionNames[key as keyof typeof functionNames]} ATIVADO`,
            message: ``
          })
        } else {
          addNotification({
            type: 'info',
            title: `${functionNames[key as keyof typeof functionNames]} DESATIVADO`,
            message: ``
          })
        }
      } else {
        throw new Error('Falha ao enviar comando')
      }
    } catch (error) {
      updateAim('misc', key, !value)
      addNotification({
        type: 'error',
        title: `Erro ao atualizar ${functionNames[key as keyof typeof functionNames]}`,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  }

  const handleEnableKeybind = async (category: keyof typeof state.aim, enabled: boolean) => {
    updateAim(category, 'keybindEnabled', enabled)
      
    if (enabled) {
      updateAim(category, 'keybind', 'F')
      addNotification({
        type: 'success',
        title: 'Keybind habilitado',
        message: `${category.toUpperCase()} keybind configurado como F (HOLD)`
      })
    } else {
      updateAim(category, 'keybind', '')
      addNotification({
        type: 'info',
        title: 'Keybind desabilitado',
        message: ``
      })
    }
  }

  return (
    <motion.div
      className="flex-1 p-4 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-4 md:mb-8 pb-4 md:pb-6 border-b border-border/30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
          <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Target className="w-4 md:w-5 h-4 md:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold gradient-text">MIRA</h1>
            <p className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-wider">SISTEMA DE MIRA AVANÇADO</p>
          </div>
        </div>
        
        <motion.div
          className="px-3 md:px-4 py-1 md:py-2 bg-green-500/10 text-green-400 rounded-lg text-xs md:text-sm font-semibold inline-flex items-center space-x-2"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>SISTEMA PRONTO</span>
        </motion.div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-card/50 border border-border rounded-lg px-1 md:px-2 py-1 mb-4 md:mb-8 backdrop-blur-sm w-fit">
          <TabsList className="justify-start">
            <TabsTrigger value="rage" className="font-semibold">Aim Full</TabsTrigger>
            <TabsTrigger value="legit" className="font-semibold">Aim Legit</TabsTrigger>
            <TabsTrigger value="misc" className="font-semibold">Outros</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="rage" className="space-y-6 tab-content-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* General Section */}
            <motion.div
              className="glass rounded-xl p-6 neon-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">GERAL</h3>
              </div>
              
              <Button
                variant="hack"
                onClick={() => handleLoad('rage')}
                className="w-full mb-6 h-12 text-base font-semibold"
                disabled={loadingCommand === 'rage'}
              >
                {loadingCommand === 'rage' ? 'CARREGANDO...' : 'LOAD'}
              </Button>
              
              <Checkbox
                label="ENABLED"
                checked={state.aim.rage.enabled}
                onChange={(e) => handleSettingChange('rage', 'enabled', e.target.checked)}
                disabled={!state.loaded.rage}
              />
            </motion.div>

            {/* Settings Section */}
            <motion.div
              className="glass rounded-xl p-6 neon-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">CONFIGURAÇÕES</h3>
              </div>
              
              <div className="space-y-6">
                <Checkbox
                  label="ENABLE KEYBIND"
                  checked={state.aim.rage.keybindEnabled}
                  onChange={(e) => handleEnableKeybind('rage', e.target.checked)}
                  disabled={!state.loaded.rage || !state.aim.rage.enabled}
                />
                
                {state.aim.rage.enabled && state.loaded.rage && state.aim.rage.keybindEnabled && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">KEY:</span>
                      <input
                        type="text"
                        value={state.aim.rage.keybind}
                        onChange={(e) => handleSettingChange('rage', 'keybind', e.target.value.toUpperCase())}
                        maxLength={1}
                        className="w-12 px-2 py-1 bg-black border border-primary rounded text-center font-mono"
                        disabled={!state.aim.rage.enabled}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="legit" className="space-y-6 tab-content-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* General Section */}
            <motion.div
              className="glass rounded-xl p-6 neon-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">GERAL</h3>
              </div>
              
              <Button
                variant="hack"
                onClick={() => handleLoad('legit')}
                className="w-full mb-6 h-12 text-base font-semibold"
                disabled={loadingCommand === 'legit'}
              >
                {loadingCommand === 'legit' ? 'CARREGANDO...' : 'LOAD'}
              </Button>
              
              <Checkbox
                label="ENABLED"
                checked={state.aim.legit.enabled}
                onChange={(e) => handleSettingChange('legit', 'enabled', e.target.checked)}
                disabled={!state.loaded.legit}
              />
            </motion.div>

            {/* Settings Section */}
            <motion.div
              className="glass rounded-xl p-6 neon-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">CONFIGURAÇÕES</h3>
              </div>
              
              <div className="space-y-6">
                <Checkbox
                  label="ENABLE KEYBIND"
                  checked={state.aim.legit.keybindEnabled}
                  onChange={(e) => handleEnableKeybind('legit', e.target.checked)}
                  disabled={!state.loaded.legit || !state.aim.legit.enabled}
                />
                
                {state.aim.legit.enabled && state.loaded.legit && state.aim.legit.keybindEnabled && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">KEY:</span>
                      <input
                        type="text"
                        value={state.aim.legit.keybind}
                        onChange={(e) => handleSettingChange('legit', 'keybind', e.target.value.toUpperCase())}
                        maxLength={1}
                        className="w-12 px-2 py-1 bg-black border border-primary rounded text-center font-mono"
                        disabled={!state.aim.legit.enabled}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="misc" className="space-y-6 tab-content-fade">
          <motion.div
            className="glass rounded-xl p-6 neon-border max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">MIRA</h3>
            </div>
            
            <div className="space-y-4">
              <Checkbox
                label="PRECISION"
                checked={state.aim.misc.precision}
                onChange={(e) => handleMiscChange('precision', e.target.checked)}
              />
              <Checkbox
                label="HS PESCOÇO"
                checked={state.aim.misc.headshot}
                onChange={(e) => handleMiscChange('headshot', e.target.checked)}
              />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}