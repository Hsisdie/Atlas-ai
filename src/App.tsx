import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell/AppShell';
import CommandCenter from './pages/CommandCenter/CommandCenter';
import DigitalTwin from './pages/DigitalTwin/DigitalTwin';
import AtlasBrain from './pages/AtlasBrain/AtlasBrain';
import AIEngine from './pages/AIEngine/AIEngine';
import Simulator from './pages/Simulator/Simulator';
import MultiAgent from './pages/MultiAgent/MultiAgent';
import FanCompanion from './pages/FanCompanion/FanCompanion';
import { SimulationProvider } from './context/SimulationContext';

const routes = [
  { path: '/', element: <CommandCenter />, title: 'Command Center' },
  { path: '/brain', element: <AtlasBrain />, title: 'Atlas Brain' },
  { path: '/digital-twin', element: <DigitalTwin />, title: 'Digital Twin' },
  { path: '/ai-engine', element: <AIEngine />, title: 'AI Engine' },
  { path: '/simulator', element: <Simulator />, title: 'Scenario Simulator' },
  { path: '/agents', element: <MultiAgent />, title: 'Multi-Agent AI' },
  { path: '/fan', element: <FanCompanion />, title: 'Fan Companion' },
];

function App() {
  return (
    <BrowserRouter>
      <SimulationProvider>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AppShell title={route.title}>
                  {route.element}
                </AppShell>
              }
            />
          ))}
        </Routes>
      </SimulationProvider>
    </BrowserRouter>
  );
}

export default App;


