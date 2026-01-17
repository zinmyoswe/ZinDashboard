import React from 'react'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <h1>Hello, Gemini!</h1>
      <ModeToggle />
    </ThemeProvider>
  )
}

export default App