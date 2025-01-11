import './App.css';
import Hello from './Hello';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Login from './Login';  
import SignUp from './SignUp';
import Dummy from './Dummy';  

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Hello />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/dummy" element={<Dummy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
