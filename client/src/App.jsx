import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import Footer from './components/sections/Footer'
import Header from './components/sections/Header'
import TopStrip from './components/sections/TopStrip'
import MobileMenu from './components/sections/MobileMenu'
import { useLenis } from './hooks'

function App() {
  useLenis()
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
