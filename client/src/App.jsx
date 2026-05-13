// src/App.jsx
//
// BrowserRouter живёт в main.jsx (Phase 0 scaffold). В App.jsx используем
// fragment + Routes. TopStrip / Header / MobileMenu лежат снаружи Routes,
// потому что они site-wide.
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import Footer from './components/sections/Footer'
import Header from './components/sections/Header'
import TopStrip from './components/sections/TopStrip'
import MobileMenu from './components/sections/MobileMenu'

function App() {
  return (
    <>
      <TopStrip />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:category" element={<CatalogPage />} />
        <Route path="/catalog/:category/:subcategory" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="*" element={null} />
      </Routes>
      <Footer />
      <MobileMenu />
    </>
  )
}

export default App
