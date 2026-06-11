import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { BoardLayout } from './components/layout/BoardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StoryMapBoardPage } from './pages/StoryMapBoardPage';
import { LoginPage } from './pages/LoginPage';
import { useIsSignedIn } from './lib/auth';

// Gate for the app shell — redirects to /login until the user has signed in.
function RequireAuth() {
  const signedIn = useIsSignedIn();
  return signedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Standalone auth page — rendered without the app shell. */}
        <Route path="/login" element={<LoginPage />} />

        {/* All app pages require sign-in. The dashboard renders inside the
            AppLayout shell (sidebar); the board opens full-screen on its own. */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
          <Route element={<BoardLayout />}>
            <Route path="/board/:mapId" element={<StoryMapBoardPage />} />
          </Route>
        </Route>

        {/* Anything else → login. */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
