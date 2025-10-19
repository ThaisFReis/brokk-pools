/**
 * Top Position Badge Demo Page
 * Demonstrates all states and features of the ranking badge
 *
 * Use this page to visually test:
 * - All 5 badge states (loading, error, not ranked, top 10, standard)
 * - Tooltip functionality with hover
 * - Auto-refresh behavior
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import { TopPosition } from '../components/TopPosition';
import type { UserRanking } from '../types/dashboard';

export const TopPositionDemo: React.FC = () => {
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Simulate auto-refresh every 5 seconds (faster than real 30s for demo)
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  // Mock data for different states
  const topTenRanking: UserRanking = {
    position: 5,
    totalMiners: 1523,
    hashrate: 8.5e12, // 8.5 TH/s
    networkShare: 5.67,
    isTopTen: true,
  };

  const standardRanking: UserRanking = {
    position: 42,
    totalMiners: 1523,
    hashrate: 3.8e12, // 3.8 TH/s
    networkShare: 2.53,
    isTopTen: false,
  };

  const lowRanking: UserRanking = {
    position: 1500,
    totalMiners: 1523,
    hashrate: 1.2e6, // 1.2 MH/s
    networkShare: 0.0008,
    isTopTen: false,
  };

  // Simulate changing rankings on refresh
  const getRefreshingRanking = (): UserRanking => {
    const positions = [1, 5, 10, 15, 42, 100, 500];
    const idx = refreshCount % positions.length;
    const position = positions[idx];

    return {
      position,
      totalMiners: 1523,
      hashrate: (1523 - position) * 1e10,
      networkShare: ((1523 - position) / 1523) * 100,
      isTopTen: position <= 10,
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Top Position Badge - Demo & Testing
          </h1>
          <p className="text-gray-400">
            Demonstração completa de todos os estados e funcionalidades do badge de ranking
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Controles de Demonstração</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefreshEnabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {autoRefreshEnabled ? '✓ Auto-refresh Ativo' : 'Ativar Auto-refresh'}
            </button>
            <span className="text-gray-400">
              {autoRefreshEnabled && `Atualizações: ${refreshCount} (a cada 5s)`}
            </span>
          </div>
        </div>

        {/* State Demonstrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* State 1: Loading */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Estado 1: Carregando
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Mostrado durante o carregamento inicial dos dados de ranking
            </p>
            <div className="flex justify-center">
              <TopPosition
                ranking={null}
                loading={true}
                error={null}
                onRetry={() => console.log('Retry clicked')}
              />
            </div>
          </div>

          {/* State 2: Error */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-red-400">
              Estado 2: Erro
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Exibido quando falha ao carregar dados. Clique no botão para tentar novamente.
            </p>
            <div className="flex justify-center">
              <TopPosition
                ranking={null}
                loading={false}
                error="Failed to load ranking data"
                onRetry={() => alert('Tentando carregar novamente...')}
              />
            </div>
          </div>

          {/* State 3: Not Ranked */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-400">
              Estado 3: Não Ranqueado
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Usuário não está no ranking ou hashrate muito baixo (&lt; 1 MH/s)
            </p>
            <div className="flex justify-center">
              <TopPosition
                ranking={null}
                loading={false}
                error={null}
                onRetry={() => console.log('Retry clicked')}
              />
            </div>
          </div>

          {/* State 4: Top 10 (Elite Miner) */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Estado 4: Top 10 - Elite Miner
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Posição 1-10: Gradiente dourado, ícone estrela, badge "Elite Miner" no tooltip
            </p>
            <div className="flex justify-center">
              <TopPosition
                ranking={topTenRanking}
                loading={false}
                error={null}
                onRetry={() => console.log('Retry clicked')}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 Passe o mouse sobre o badge para ver o tooltip com detalhes
            </p>
          </div>

          {/* State 5: Standard Ranking */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Estado 5: Ranking Padrão
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Posição 11+: Gradiente azul/roxo, ícone gráfico, sem badge especial
            </p>
            <div className="flex justify-center">
              <TopPosition
                ranking={standardRanking}
                loading={false}
                error={null}
                onRetry={() => console.log('Retry clicked')}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 Passe o mouse sobre o badge para ver o tooltip
            </p>
          </div>

          {/* Low Ranking Example */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">
              Exemplo: Ranking Baixo
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Posição próxima ao final: Hashrate baixo, network share &lt; 1%
            </p>
            <div className="flex justify-center">
              <TopPosition
                ranking={lowRanking}
                loading={false}
                error={null}
                onRetry={() => console.log('Retry clicked')}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Note a precisão de 4 decimais no network share (&lt; 1%)
            </p>
          </div>
        </div>

        {/* Auto-refresh Demo */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-green-400">
            Demonstração de Auto-refresh
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Ative o auto-refresh acima para ver a posição mudar automaticamente a cada 5 segundos.
            O badge atualiza sem mostrar loading (silent refresh).
          </p>
          <div className="flex justify-center">
            <TopPosition
              ranking={autoRefreshEnabled ? getRefreshingRanking() : standardRanking}
              loading={false}
              error={null}
              onRetry={() => console.log('Retry clicked')}
            />
          </div>
          {autoRefreshEnabled && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              Posição atual: #{getRefreshingRanking().position} | Próxima atualização em 5s
            </p>
          )}
        </div>

        {/* Feature Checklist */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Checklist de Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">User Story 1: Badge Display</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>5 estados visuais distintos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Gradientes dourado (top 10) e azul/roxo (padrão)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ícones contextuais (estrela, gráfico, erro, etc)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Estado de loading com spinner</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Estado de erro com botão retry</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-400 mb-2">User Story 2: Tooltip</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Aparece no hover sobre o badge</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Posição formatada "#X of Y miners"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Hashrate com unidades automáticas (TH/s, GH/s, MH/s)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Network share com precisão dinâmica</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Badge "Elite Miner" para top 10</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Click-outside para fechar (mobile)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Tecla ESC para fechar</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2">User Story 3: Auto-refresh</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Atualização automática a cada 30s</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Silent refresh (sem loading spinner)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Badge atualiza quando posição muda</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cleanup adequado (sem memory leaks)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Continua após erros</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Acessibilidade</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>ARIA labels em todos os estados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Navegação por teclado (Tab, ESC)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Atributos aria-expanded/describedby</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Touch targets ≥ 44px</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Gerenciamento de foco</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">
            📋 Como Testar
          </h3>
          <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
            <li>Passe o mouse sobre cada badge para ver o tooltip aparecer</li>
            <li>Verifique as informações no tooltip (posição, hashrate, network share)</li>
            <li>Para top 10, confirme o badge "Elite Miner" dourado no tooltip</li>
            <li>Clique no botão "Retry" no estado de erro</li>
            <li>Ative o auto-refresh e observe a posição mudar a cada 5 segundos</li>
            <li>Teste em diferentes tamanhos de tela (mobile, tablet, desktop)</li>
            <li>Use Tab para navegar pelo teclado</li>
            <li>Pressione ESC quando o tooltip estiver aberto para fechá-lo</li>
          </ol>
        </div>

        {/* Technical Info */}
        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-400">
            🔧 Informações Técnicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p><strong>Componente:</strong> TopPosition</p>
              <p><strong>Hook:</strong> useRanking</p>
              <p><strong>Auto-refresh:</strong> 30 segundos (produção)</p>
              <p><strong>Testes:</strong> 83/83 passing (100%)</p>
            </div>
            <div>
              <p><strong>Tasks Completas:</strong> T001-T047 (47/59)</p>
              <p><strong>User Stories:</strong> 1, 2, 3 ✓</p>
              <p><strong>Progresso:</strong> ~80%</p>
              <p><strong>Próximo:</strong> Polish & Validation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPositionDemo;
