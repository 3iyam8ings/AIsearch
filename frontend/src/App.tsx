import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import './index.css';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Blog from './pages/Blog';
import ApiDocs from './pages/ApiDocs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Features from './pages/Features';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Chat Route */}
        <Route 
          path="/" 
          element={session ? <Chat session={session} /> : <Navigate to="/signup" />} 
        />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!session ? <Signup /> : <Navigate to="/" />} 
        />
        
        {/* Blog Route */}
        <Route path="/blog" element={<Blog />} />
        
        {/* API Docs Route */}
        <Route path="/api" element={<ApiDocs />} />
        
        {/* Privacy Policy Route */}
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Terms of Service Route */}
        <Route path="/terms" element={<Terms />} />
        
        {/* Features Route */}
        <Route path="/features" element={<Features />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
