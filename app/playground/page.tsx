'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';

type TabId = 'chat' | 'compare' | 'media' | 'live' | 'url' | 'usage';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'chat', label: 'Chat', icon: '\ud83d\udcac' },
  { id: 'compare', label: 'Compare', icon: '\u2696\ufe0f' },
  { id: 'media', label: 'Media', icon: '\ud83c\udfa8' },
  { id: 'live', label: 'Live', icon: '\ud83c\udf99\ufe0f' },
  { id: 'url', label: 'URL', icon: '\ud83d\udd17' },
  { id: 'usage', label: 'Usage', icon: '\ud83d\udcca' },
];

const PERSONAS: Record<string, { name: string; icon: string }> = {
  professional: { name: 'Professional', icon: '\ud83d\udc88' },
  friendly: { name: 'Friendly', icon: '\ud83d\ude0a' },
  creative: { name: 'Creative', icon: '\ud83c\udfa8' },
  concise: { name: 'Concise', icon: '\u26a1' },
  academic: { name: 'Academic', icon: '\ud83d\udcda' },
  witty: { name: 'Witty', icon: '\ud83d\ude0e' },
};

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const store = useStore();

  useEffect(() => {
    if (!store.currentConversationId && store.aiConversations.length === 0) {
      store.createConversation('gemini-2.5-flash');
    } else if (!store.currentConversationId && store.aiConversations.length > 0) {
      useStore.setState({ currentConversationId: store.aiConversations[0].id });
    }
  }, []);

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold gradient-text">AI Playground</h1>
            <div className="flex items-center gap-2">
              {/* Persona badge */}
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                {PERSONAS[store.aiPersona]?.icon} {PERSONAS[store.aiPersona]?.name}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{store.aiModels.length} models</span>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { haptic('selection'); setActiveTab(tab.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={activeTab === tab.id
                  ? { background: 'var(--gradient)', color: '#fff' }
                  : { background: 'var(--card)', color: 'var(--muted)' }
                }
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-4">
        {activeTab === 'chat' && <ChatMode />}
        {activeTab === 'compare' && <CompareMode />}
        {activeTab === 'media' && <MediaMode />}
        {activeTab === 'live' && <LiveMode />}
        {activeTab === 'url' && <URLMode />}
        {activeTab === 'usage' && <UsageMode />}
      </div>
    </div>
  );
}

function ChatMode() {
  const [input, setInput] = useState('');
  const [showSystem, setShowSystem] = useState(false);
  const [systemText, setSystemText] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const store = useStore();

  const conv = store.aiConversations.find((c) => c.id === store.currentConversationId);
  const currentModel = store.aiModels.find((m) => m.id === conv?.model);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conv?.messages.length, store.isStreaming]);
  useEffect(() => { if (conv) setSystemText(conv.systemInstruction); }, [store.currentConversationId]);

  const handleSend = () => {
    if (!input.trim() || store.isStreaming) return;
    haptic('light');
    store.sendAIMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => { haptic('light'); setShowModelPicker(!showModelPicker); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm flex-1"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: currentModel?.color }} />
          <span className="font-medium">{currentModel?.name || 'Select model'}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${currentModel?.color}22`, color: currentModel?.color }}>{currentModel?.badge}</span>
        </button>
        <button onClick={() => { haptic('light'); setShowSystem(!showSystem); }} className="px-3 py-2 rounded-xl text-sm" style={showSystem ? { background: 'var(--gradient)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--border)' }}>\u2699\ufe0f</button>
      </div>

      {showModelPicker && (
        <div className="mb-3 space-y-1 p-2 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {store.aiModels.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                haptic('selection');
                if (store.currentConversationId) {
                  useStore.setState((s) => ({ aiConversations: s.aiConversations.map((c) => c.id === s.currentConversationId ? { ...c, model: m.id } : c) }));
                }
                setShowModelPicker(false);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-lg text-left"
              style={conv?.model === m.id ? { background: 'var(--surface)' } : {}}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <div className="flex-1"><div className="text-sm font-medium">{m.name}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>{m.description}</div></div>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${m.color}22`, color: m.color }}>{m.badge}</span>
            </button>
          ))}
        </div>
      )}

      {showSystem && (
        <div className="mb-3">
          <textarea
            value={systemText}
            onChange={(e) => setSystemText(e.target.value)}
            onBlur={() => store.setSystemInstruction(systemText)}
            placeholder="System instruction: Define the model's role, tone, and constraints..."
            rows={3}
            className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3">
        {conv?.messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">\u2728</div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Send a message to start chatting with {currentModel?.name}</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['Write a poem about space', 'Explain quantum computing', 'Generate an image of a sunset', 'Summarize a URL'].map((s) => (
                <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 rounded-full text-xs" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {conv?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style={msg.role === 'user'
                ? { background: 'var(--gradient)', color: '#fff', borderRadius: '0 0 0.5rem 0' }
                : { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '0 0 0 0.5rem' }
              }
            >
              {msg.content}
              {msg.tokens && (
                <div className="text-[10px] mt-1.5 flex gap-3" style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>
                  <span>{msg.tokens} tokens</span>
                  {msg.latency && <span>{(msg.latency / 1000).toFixed(1)}s</span>}
                  {msg.model && <span>{store.aiModels.find((m) => m.id === msg.model)?.name}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
        {store.isStreaming && (
          <div className="flex justify-start animate-fade-in">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--muted)', animationDelay: `${i*0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass border-t z-40" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto flex items-center gap-2 px-4 py-3 pb-[72px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini anything..."
            disabled={store.isStreaming}
            className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none disabled:opacity-50"
            style={{ background: 'var(--card)', color: 'var(--text)' }}
          />
          <button onClick={handleSend} disabled={!input.trim() || store.isStreaming} className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30" style={{ background: 'var(--gradient)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareMode() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ a: string; b: string; prompt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const modelA = store.aiModels.find((m) => m.id === store.compareModelA)!;
  const modelB = store.aiModels.find((m) => m.id === store.compareModelB)!;

  const handleCompare = () => {
    if (!input.trim()) return;
    haptic('medium');
    setLoading(true); setResults(null);
    const respA = simulateCompare(input, modelA.id);
    const respB = simulateCompare(input, modelB.id);
    setTimeout(() => {
      setResults({ a: respA, b: '', prompt: input.trim() });
      setTimeout(() => { setResults({ a: respA, b: respB, prompt: input.trim() }); setLoading(false); }, 800);
    }, 600);
    setInput('');
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-1">Compare Models</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Send one prompt, see responses from two models side-by-side</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[{ m: modelA, key: 'a' }, { m: modelB, key: 'b' }].map(({ m, key }) => (
          <div key={key} className="rounded-xl p-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <select value={key === 'a' ? store.compareModelA : store.compareModelB} onChange={(e) => { haptic('selection'); key === 'a' ? store.setCompareModels(e.target.value, store.compareModelB) : store.setCompareModels(store.compareModelA, e.target.value); }} className="bg-transparent text-sm font-medium flex-1 outline-none" style={{ color: 'var(--text)' }}>
                {store.aiModels.filter((m) => !m.id.includes('nano') && !m.id.includes('veo')).map((m) => <option key={m.id} value={m.id} className="bg-[var(--surface)]">{m.name}</option>)}
              </select>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.description}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCompare()} placeholder="Enter a prompt to compare..." className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--card)', color: 'var(--text)' }} />
        <button onClick={handleCompare} disabled={!input.trim() || loading} className="px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30" style={{ background: 'var(--gradient)', color: '#fff' }}>Compare</button>
      </div>
      {(results || loading) && (
        <div className="grid grid-cols-2 gap-3">
          {[{ content: results?.a, model: modelA }, { content: results?.b, model: modelB }].map((r, i) => (
            <div key={i} className="rounded-xl p-3 min-h-[200px]" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: r.model.color }} />
                <span className="text-xs font-medium">{r.model.name}</span>
              </div>
              {r.content ? <div className="text-xs leading-relaxed whitespace-pre-wrap">{r.content}</div> : <div className="flex gap-1 mt-4">{[0,1,2].map(j => <div key={j} className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--muted)', animationDelay: `${j*0.2}s` }} />)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function simulateCompare(prompt: string, modelId: string): string {
  const isFlash = modelId.includes('flash');
  const prefix = isFlash ? '\u26a1 Quick response:\n\n' : '\ud83e\udce0 Deep analysis:\n\n';
  if (prompt.toLowerCase().includes('poem')) return prefix + 'In circuits deep where data flows,\nA spark of thought in silence grows.\nThe code hums soft, a whispered song,\nOf logic right and reasoning wrong.';
  if (prompt.toLowerCase().includes('code')) return prefix + 'Here\u2019s a clean implementation:\n\n```js\nconst result = items.filter(x => x.valid).map(x => transform(x));\n```\n\nFunctional and readable.';
  return prefix + `Based on your prompt: "${prompt.slice(0, 60)}..."\n\nThis is a simulated response from ${modelId}. ${isFlash ? 'Flash models prioritize speed.' : 'Pro models prioritize depth.'}`;
}

function MediaMode() {
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const store = useStore();
  const nano = store.aiModels.find((m) => m.id === 'nano-banana')!;

  const handleGen = () => {
    if (!input.trim()) return;
    haptic('medium'); setGenerating(true);
    setTimeout(() => { store.generateImage(input.trim()); setGenerating(false); setInput(''); haptic('success'); }, 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full" style={{ background: nano.color }} /><h2 className="text-lg font-bold">Generate Media</h2><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${nano.color}22`, color: nano.color }}>{nano.badge}</span></div>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Create images with AI \u2014 powered by Nano Banana</p>
      <div className="flex gap-2 mb-4">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGen()} placeholder="A serene mountain landscape at sunset..." className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--card)', color: 'var(--text)' }} />
        <button onClick={handleGen} disabled={!input.trim() || generating} className="px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30" style={{ background: 'var(--gradient)', color: '#fff' }}>{generating ? '...' : 'Generate'}</button>
      </div>
      {generating && <div className="aspect-square rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><div className="text-center"><div className="text-4xl mb-2 animate-spin inline-block">\ud83c\udfa8</div><p className="text-sm" style={{ color: 'var(--muted)' }}>Generating image...</p></div></div>}
      {store.generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {store.generatedImages.map((img) => (
            <div key={img.id} className="rounded-2xl overflow-hidden animate-fade-in" style={{ border: '1px solid var(--border)' }}>
              <div className="aspect-square flex items-center justify-center" style={{ background: img.gradient }}><span className="text-5xl">{img.emoji}</span></div>
              <div className="p-2" style={{ background: 'var(--card)' }}><div className="text-xs font-medium truncate">{img.prompt}</div><div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{img.model}</div></div>
            </div>
          ))}
        </div>
      )}
      {store.generatedImages.length === 0 && !generating && (
        <div className="text-center py-12"><div className="text-5xl mb-4">\ud83c\udfa8</div><p className="text-sm" style={{ color: 'var(--muted)' }}>No images yet. Describe what you want to create!</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">{['Sunset over mountains', 'Cyberpunk city street', 'Cute robot character', 'Abstract art with blue tones'].map((s) => <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 rounded-full text-xs" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>{s}</button>)}</div></div>
      )}
    </div>
  );
}

function LiveMode() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const phrases = ['Hello! How can I help you today?', 'That\u2019s interesting. Tell me more.', 'I understand. Let me think about that.', 'Great question! Here\u2019s what I think...', 'I see what you mean.'];
  const toggle = () => {
    haptic('impact');
    if (isListening) { setIsListening(false); setAiResponse(phrases[Math.floor(Math.random() * phrases.length)]); }
    else { setIsListening(true); setTranscript(''); setAiResponse(''); setTimeout(() => setTranscript('Hey Gemini, what\u2019s the weather like today?'), 1000); }
  };
  return (
    <div className="flex flex-col items-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <h2 className="text-lg font-bold mb-1">Live Voice</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Real-time voice conversation with Gemini</p>
      <div className="flex-1 flex items-center justify-center">
        <button onClick={toggle} className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
          {isListening && <><div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ background: 'var(--gradient)' }} /><div className="absolute inset-4 rounded-full opacity-30 animate-pulse" style={{ background: 'var(--gradient)' }} /></>}
          <div className="relative flex items-center justify-center rounded-full transition-all" style={{ width: 120, height: 120, background: isListening ? 'var(--gradient)' : 'var(--card)', border: isListening ? 'none' : '2px solid var(--border)' }}>
            {isListening ? (
              <div className="flex items-end gap-1 h-8">{[0,1,2,3,4].map((i) => <div key={i} className="w-1 rounded-full" style={{ background: '#fff', animation: `wave 0.6s ease-in-out ${i*0.1}s infinite` }} />)}</div>
            ) : (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--text)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 18v3M12 1v3M4 11a8 8 0 0116 0" /><rect x="9" y="11" width="6" height="8" rx="3" /></svg>
            )}
          </div>
        </button>
      </div>
      {transcript && <div className="w-full mt-6 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>You said:</div><div className="text-sm">{transcript}</div></div>}
      {aiResponse && <div className="w-full mt-3 p-3 rounded-xl" style={{ background: 'var(--gradient)', color: '#fff' }}><div className="text-xs mb-1 opacity-50">Gemini:</div><div className="text-sm">{aiResponse}</div></div>}
      <div className="mt-6 text-xs" style={{ color: 'var(--muted)' }}>{isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}</div>
    </div>
  );
}

function URLMode() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const handleAnalyze = () => {
    if (!url.trim()) return;
    haptic('medium'); setLoading(true); setSummary('');
    setTimeout(() => {
      setSummary(`I've retrieved and analyzed the content from ${url}.\n\n**Summary:**\n\u2022 The page appears to be a web resource with relevant content\n\u2022 Key topics include the main subject matter\n\u2022 The content is structured for readability\n\n*Note: In production, the URL Context tool would fetch real content.*`);
      setLoading(false); haptic('success');
    }, 1500);
    setUrl('');
  };
  return (
    <div>
      <h2 className="text-lg font-bold mb-1">URL Context</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Paste a URL and let AI read and summarize it</p>
      <div className="flex gap-2 mb-4">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="https://example.com/article" className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--card)', color: 'var(--text)' }} />
        <button onClick={handleAnalyze} disabled={!url.trim() || loading} className="px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30" style={{ background: 'var(--gradient)', color: '#fff' }}>{loading ? '...' : 'Analyze'}</button>
      </div>
      {loading && <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--muted)', animationDelay: `${i*0.2}s` }} />)}</div><span className="text-sm" style={{ color: 'var(--muted)' }}>Fetching and analyzing content...</span></div>}
      {summary && <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><div className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</div></div>}
      {!loading && !summary && <div className="text-center py-12"><div className="text-5xl mb-4">\ud83d\udd17</div><p className="text-sm" style={{ color: 'var(--muted)' }}>Paste any URL to get an AI-powered summary</p></div>}
    </div>
  );
}

function UsageMode() {
  const store = useStore();
  return (
    <div>
      <h2 className="text-lg font-bold mb-1">Rate Limits & Usage</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Monitor your API usage across all models</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><div className="text-xs" style={{ color: 'var(--muted)' }}>Total tokens used</div><div className="text-2xl font-bold font-mono mt-1">{store.totalTokensUsed.toLocaleString()}</div></div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><div className="text-xs" style={{ color: 'var(--muted)' }}>Est. cost</div><div className="text-2xl font-bold font-mono mt-1">${store.totalEstimatedCost.toFixed(4)}</div></div>
      </div>
      <div className="space-y-2">
        {store.aiModels.map((m) => (
          <div key={m.id} className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full" style={{ background: m.color }} /><span className="text-sm font-medium flex-1">{m.name}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${m.color}22`, color: m.color }}>{m.badge}</span></div>
            <div className="grid grid-cols-3 gap-2 text-xs"><div><div style={{ color: 'var(--muted)' }}>RPM</div><div className="font-mono font-medium">{m.rpm.toLocaleString()}</div></div><div><div style={{ color: 'var(--muted)' }}>TPM</div><div className="font-mono font-medium">{m.tpm > 0 ? m.tpm.toLocaleString() : '\u2014'}</div></div><div><div style={{ color: 'var(--muted)' }}>RPD</div><div className="font-mono font-medium">{m.rpd.toLocaleString()}</div></div></div>
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}><div className="h-full rounded-full" style={{ width: `${Math.min((store.usageRpm / m.rpm) * 100, 100)}%`, background: m.color }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
