import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectsProvider } from './context/ProjectsContext';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import ProjectForm from './pages/ProjectForm';
import MediaLibrary from './pages/MediaLibrary';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <ProjectsProvider>
        <ToastProvider>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </ToastProvider>
      </ProjectsProvider>
    </BrowserRouter>
  );
}
