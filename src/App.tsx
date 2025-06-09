import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import { SpaProvider } from './context/SpaContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Header from './components/layout/Header';

function App() {
  return (
    <SpaProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
      </SpaProvider>
  );
}

export default App;