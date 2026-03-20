import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell/AppShell'
import { Module1Page } from './modules/module1/pages/Module1Page'
import { Module2Page } from './modules/module2/pages/Module2Page'
import { Module3Page } from './modules/module3/pages/Module3Page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/module2" replace />} />
          <Route path="/module1" element={<Module1Page />} />
          <Route path="/module2" element={<Module2Page />} />
          <Route path="/module3" element={<Module3Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
