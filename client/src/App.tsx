import { SimulationCanvas } from './components/SimulationCanvas'

function App() {
  return (
    <div style={{ padding: '24px', background: '#0f0f1a', minHeight: '100vh' }}>
      <h1 style={{ color: '#4a9eff', marginBottom: '16px', fontSize: '20px' }}>
        人流シミュレーション
      </h1>
      <SimulationCanvas />
    </div>
  )
}

export default App
