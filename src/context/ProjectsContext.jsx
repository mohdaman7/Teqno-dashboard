import { createContext, useContext, useState, useEffect } from 'react';

const ProjectsContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects from API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('File upload failed');
    const data = await res.json();
    return data.url; // Returns '/uploads/filename.ext'
  };

  const addProject = async (project) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to add project');
    }
    const newProject = await res.json();
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id, updates) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update project');
    }
    const updated = await res.json();
    setProjects(prev => prev.map(p => p.id === id || p.slug === id ? updated : p));
    return updated;
  };

  const deleteProject = async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete project');
    setProjects(prev => prev.filter(p => p.id !== id && p.slug !== id));
  };

  const getProject = (id) => projects.find(p => p.id === id || p.slug === id);

  const publishProject = (id) => updateProject(id, { status: 'published' });
  const draftProject = (id) => updateProject(id, { status: 'draft' });

  return (
    <ProjectsContext.Provider value={{
      projects,
      loading,
      error,
      addProject,
      updateProject,
      deleteProject,
      getProject,
      publishProject,
      draftProject,
      uploadFile,
      refreshProjects: fetchProjects
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
};
