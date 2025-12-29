import { useState } from 'react'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Cart from './components/Cart.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Cart/>
    </>
  )
}

export default App
