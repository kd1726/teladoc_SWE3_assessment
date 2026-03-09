import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useMediaQuery } from 'react-responsive'
import Desktop from './Desktop'
import Mobile from './Mobile'

function App() {

  const isMobile: ReturnType<typeof useMediaQuery> = useMediaQuery({
    query: "(max-width: 700px)"
  })


  return isMobile ? <Mobile /> : <Desktop />
}

export default App
