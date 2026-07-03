import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/theme'
import { appRouter } from './router'

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  )
}

export default App
