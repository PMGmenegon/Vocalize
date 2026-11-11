import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import PublicLayout from './layouts/PublicLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PracticePage from './pages/app/PracticePage'
import ProfilePage from './pages/app/ProfilePage'
import ReviewPage from './pages/app/ReviewPage'
import StatsPage from './pages/app/StatsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site público */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Área logada (o login real chega numa fase futura) */}
        <Route path="app" element={<AppLayout />}>
          <Route index element={<Navigate to="praticar" replace />} />
          <Route path="praticar" element={<PracticePage />} />
          <Route path="estatisticas" element={<StatsPage />} />
          <Route path="revisao" element={<ReviewPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
