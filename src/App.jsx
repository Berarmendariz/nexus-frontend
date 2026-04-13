import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SimulatorPage from './pages/SimulatorPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import ComparePage from './pages/ComparePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
