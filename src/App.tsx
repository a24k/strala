import { WorkingStralaCanvas } from './components/Canvas/WorkingStralaCanvas';
import { GlobalSettings } from './components/GlobalSettings';
import { LayersList } from './components/LayersList';
import { ActiveLayerControls } from './components/ActiveLayerControls';
import './index.css';

function App() {

  return (
    <div className="h-screen w-screen flex bg-strala-navy">
      {/* Canvas Container - Left Side (Main Area) */}
      <div className="flex-1 flex justify-center items-center bg-strala-navy">
        <div className="rounded-lg canvas-shadow">
          <WorkingStralaCanvas />
        </div>
      </div>

      {/* Control Panel - Right Side (Fixed Sidebar) */}
      <div className="w-80 flex flex-col bg-strala-dark-blue border-l border-strala-border">
        <GlobalSettings />
        <LayersList />
        <ActiveLayerControls />
      </div>
    </div>
  );
}

export default App;