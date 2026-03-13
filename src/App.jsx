import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pricing from './pages/Pricing';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pricing />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;