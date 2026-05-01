// src/App.jsx
//
// Корневой компонент. Содержит роуты и компоненты, которые
// рендерятся на всех страницах (Footer; Header / TopStrip / MobileMenu
// добавляются в Phase 3B).
// BrowserRouter находится в main.jsx.
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Footer from './components/sections/Footer'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />`
      </Routes>
      <Footer />
    </>
  )
}

export default App
