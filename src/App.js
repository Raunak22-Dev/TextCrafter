import './App.css';
import Navbar from './components/Navbar';
import Text from './components/Text';
import About from './components/About';
import {
  BrowserRouter as Router,
  Route,
  Routes, 
} from "react-router-dom";

function App() {
  return (
    <Router> 
      <Navbar title="TextCrafter" about="About" />
      <div className="container">
        <Routes>
          <Route path="/" element={<Text heading="Enter Text to analyze" />} />  
          <Route path="/about" element={<About />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
