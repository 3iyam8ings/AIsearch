import { useEffect, useState, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';

interface Convo {
  id: string;
  title: string;
}

interface Message {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

// Helper to parse the XML structured response from the LLM
function parseAiContent(rawContent: string) {
  const titleMatch = rawContent.match(/<TITLE>([\s\S]*?)<\/TITLE>/);
  const answerMatch = rawContent.match(/<ANSWER>([\s\S]*?)(?:<\/ANSWER>|$)/);
  const followUpsMatch = rawContent.match(/<FOLLOW_UPS>([\s\S]*?)<\/FOLLOW_UPS>/);
  
  const followUps: string[] = [];
  if (followUpsMatch) {
    const qs = followUpsMatch[1].matchAll(/<QUESTION>(.*?)<\/QUESTION>/g);
    for (const m of qs) followUps.push(m[1].trim());
  }

  let answer = answerMatch ? answerMatch[1].trim() : rawContent;

  // Clean up answer if the LLM nested <FOLLOW_UPS> inside <ANSWER> or forgot </ANSWER>
  // Also handle the case where the LLM forgets the `<` character (e.g. FOLLOW_UPS>)
  answer = answer.replace(/<?FOLLOW_UPS>[\s\S]*?(?:<\/FOLLOW_UPS>|$)/i, '').trim();
  // Clean up any other remaining tags like <TITLE> that might have leaked
  answer = answer.replace(/<?TITLE>[\s\S]*?<\/TITLE>/i, '').trim();
  // Strip stray tags (with or without the leading < if they end with >)
  answer = answer.replace(/<?\/?(ANSWER|TITLE|FOLLOW_UPS|QUESTION)>/gi, '').trim();

  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    answer: answer,
    followUps
  };
}

interface ChatProps {
  session: Session;
}

export default function Chat({ session }: ChatProps) {
  const [conversations, setConversations] = useState<Convo[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<any>(null); // Holds the currently streaming active response
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations list when session changes
  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  // Fetch a specific conversation's history when clicked
  useEffect(() => {
    if (session && conversationId) {
      fetchConversationThread(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId, session]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  async function fetchConversations() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) { console.error(e); }
  }

  async function fetchConversationThread(id: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (e) { console.error(e); }
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (conversationId === id) setConversationId(null);
      fetchConversations();
    } catch (err) { console.error(err); }
  }

  function handleNewChat() {
    setConversationId(null);
    setMessages([]);
    setStreamingResponse(null);
    setQuery('');
  }

  async function handleSearch(e?: React.FormEvent, overrideQuery?: string) {
    if (e) e.preventDefault();
    const q = overrideQuery || query;
    if (!session || !q.trim()) return;

    // Immediately add user message to UI
    setMessages(prev => [...prev, { role: 'USER', content: q }]);
    setQuery('');
    setIsSearching(true);
    setStreamingResponse({ title: 'Thinking...', answer: '', followUps: [], sources: [], raw: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ query: q, conversationId }),
      });
      
      if (!res.ok) {
        throw new Error('Search failed');
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let rawAiResponse = '';
      let sources: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.trim().slice(6));
              
              if (parsed.type === 'sources') {
                sources = parsed.data;
                setStreamingResponse({ title: 'Thinking...', answer: '', followUps: [], sources, raw: '' });
              } 
              else if (parsed.type === 'chunk') {
                rawAiResponse += parsed.data;
                const parsedXml = parseAiContent(rawAiResponse);
                setStreamingResponse({ ...parsedXml, sources, raw: rawAiResponse });
              } 
              else if (parsed.type === 'done') {
                setIsSearching(false);
                if (parsed.conversationId) {
                  setConversationId(parsed.conversationId);
                  fetchConversations(); // refresh sidebar title
                }
                
                // Add the finalized assistant message to the thread, clear streaming state
                setMessages(prev => [...prev, { role: 'ASSISTANT', content: rawAiResponse }]);
                setStreamingResponse(null);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsSearching(false);
      setStreamingResponse(null);
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <button className="new-chat-btn" onClick={handleNewChat}>+ New</button>
        </div>
        <div className="conversation-list">
          {conversations.map(c => (
            <div 
              key={c.id} 
              className={`conversation-item ${c.id === conversationId ? 'active' : ''}`}
              onClick={() => setConversationId(c.id)}
            >
              <span className="conversation-title">{c.title || 'New Search'}</span>
              <button className="delete-btn" onClick={(e) => deleteConversation(c.id, e)}>&times;</button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="main-area" onClick={() => {
        if (isSidebarOpen) setIsSidebarOpen(false);
        if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
      }}>
        <div className="top-bar">
          <button className="hamburger-btn" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="top-bar-center">
            <img src={logo} alt="Spark AI Logo" className="top-bar-logo" />
            Spark AI
          </div>

          <div style={{ position: 'relative' }}>
            {session.user.user_metadata?.avatar_url ? (
              <>
                <img 
                  src={session.user.user_metadata.avatar_url} 
                  alt="User Avatar" 
                  className="user-avatar"
                  onClick={(e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); }} 
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item" onClick={() => supabase.auth.signOut()}>
                      Log Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button className="logout-btn" onClick={() => supabase.auth.signOut()}>Log Out</button>
            )}
          </div>
        </div>

        <div className="chat-history">
          {messages.length === 0 && !streamingResponse && (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', marginTop: '10vh' }}>
              <h2>What do you want to know?</h2>
              <p>Ask anything. I will search the web and synthesize an answer.</p>
            </div>
          )}

          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.role === 'USER' ? 'message-user' : 'message-assistant'}`}>
              {m.role === 'USER' ? (
                <div className="bubble">{m.content}</div>
              ) : (
                <>
                  {/* Parsing historical XML responses */}
                  {(() => {
                    const parsed = parseAiContent(m.content);
                    return (
                      <>
                        <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>{parsed.answer}</div>
                      </>
                    )
                  })()}
                </>
              )}
            </div>
          ))}

          {/* Actively streaming message */}
          {streamingResponse && (
            <div className="message message-assistant">
              <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>{streamingResponse.answer}</div>
              
              {streamingResponse.sources?.length > 0 && (
                <div className="sources-section">
                  <h4>Sources:</h4>
                  <div className="sources-list">
                    {streamingResponse.sources.map((src: any, i: number) => (
                      <a key={i} href={src.url} target="_blank" rel="noreferrer" className="source-card">
                        <div className="source-card-index">[{i + 1}]</div>
                        <div className="source-card-title">{src.title}</div>
                        <div className="source-card-url">{new URL(src.url).hostname}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {streamingResponse.followUps?.length > 0 && !isSearching && (
                <div className="follow-ups">
                  {streamingResponse.followUps.map((f: string, i: number) => (
                    <button key={i} className="follow-up-btn" onClick={() => handleSearch(undefined, f)}>
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="input-area">
          <form className="input-container" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="chat-input"
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Ask a follow-up..." 
              disabled={isSearching}
            />
            <button type="submit" className="send-btn" disabled={isSearching || !query.trim()}>
              {isSearching ? '...' : 'Search'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
