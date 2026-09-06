'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatTime } from '@/lib/utils';

type TabId = 'chat' | 'compare' | 'media' | 'live' | 'url' | 'usage';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'compare', label: 'Compare', icon: '⚖️' },
  { id: 'media', label: 'Media', icon: '🎨' },
  { id: 'live', label: 'Live', icon: '🎙️' },
  { id: 'url', label: 'URL', icon: '🔗' },
  { id: 'usage', label: 'Usage', icon: '📊' },
];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const store = useStore();

  // Ensure a conversation exists
  useEffect(() => {
    if (!store.currentConversationId && store.aiConversations.length === 0) {
      store.createConversation('gemini-2.5-flash');
    } else if (!store.currentConversationId && store.aiConversations.length > 0) {
      store.useStore.setState({ currentConversationId: store.aiConversations[0].id });
    }
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass sticky top-0 z-30 border-b border-nexus-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold gradient-text">AI Playground</h1>
            <span className="text-xs font-mono text-nexus-muted">{store.aiModels.length} models</span>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'gradient-bg text-white'
                    : 'bg-nexus-card text-nexus-muted hover:text-nexus-text'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
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

// ─── Chat Mode ─────────────────────────────────────────
function ChatMode() {
  const [input, setInput] = useState('');
  const [showSystem, setShowSystem] = useState(false);
  const [systemText, setSystemText] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const store = useStore();

  const conv = store.aiConversations.find((c) => c.id === store.currentConversationId);
  const currentModel = store.aiModels.find((m) => m.id === conv?.model);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages.length, store.isStreaming]);

  useEffect(() => {
    if (conv) setSystemText(conv.systemInstruction);
  }, [store.currentConversationId]);

  const handleSend = () => {
    if (!input.trim() || store.isStreaming) return;
    store.sendAIMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {/* Model selector + system instruction */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nexus-card border border-nexus-border text-sm flex-1"
        >
          <div className="w-2 h-2 rounded-full" style={{ background: currentModel?.color }} />
          <span className="font-medium">{currentModel?.name || 'Select model'}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${currentModel?.color}22`, color: currentModel?.color }}>
            {currentModel?.badge}
          </span>
        </button>
        <button
          onClick={() => setShowSystem(!showSystem)}
          className={`px-3 py-2 rounded-xl text-sm ${showSystem ? 'gradient-bg text-white' : 'bg-nexus-card border border-nexus-border'}`}
        >
          ⚙️
        </button>
      </div>

      {showModelPicker && (
        <div className="mb-3 space-y-1 p-2 rounded-xl bg-nexus-card border border-nexus-border">
          {store.aiModels.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                if (store.currentConversationId) {
                  useStore.setState((s) => ({
                    aiConversations: s.aiConversations.map((c) =>
                      c.id === s.currentConversationId ? { ...c, model: m.id } : c
                    ),
                  }));
                }
                setShowModelPicker(false);
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${conv?.model === m.id ? 'bg-nexus-surface' : 'hover:bg-nexus-surface'}`}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <div className="flex-1">
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs text-nexus-muted">{m.description}</div>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${m.color}22`, color: m.color }}>
                {m.badge}
              </span>
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
            className="w-full bg-nexus-card rounded-xl px-3 py-2 text-sm placeholder:text-nexus-muted resize-none border border-nexus-border"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {conv?.messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-nexus-muted text-sm">Send a message to start chatting with {currentModel?.name}</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['Write a poem about space', 'Explain quantum computing', 'Generate an image of a sunset', 'Summarize a URL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-3 py-1.5 rounded-full bg-nexus-card border border-nexus-border text-xs text-nexus-muted hover:text-nexus-text"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {conv?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
              msg.role === 'user'
                ? 'gradient-bg text-white rounded-br-md'
                : 'bg-nexus-card text-nexus-text rounded-bl-md border border-nexus-border'
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              {msg.tokens && (
                <div className={`text-[10px] mt-1.5 flex gap-3 ${msg.role === 'user' ? 'text-white/50' : 'text-nexus-muted'}`}>
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
            <div className="bg-nexus-card rounded-2xl rounded-bl-md px-4 py-3 border border-nexus-border">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-nexus-border z-40">
        <div className="max-w-lg mx-auto flex items-center gap-2 px-4 py-3 pb-[72px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini anything..."
            disabled={store.isStreaming}
            className="flex-1 bg-nexus-card rounded-full px-4 py-2.5 text-sm placeholder:text-nexus-muted disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || store.isStreaming}
            className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center disabled:opacity-30"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compare Mode ──────────────────────────────────────
function CompareMode() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ a: string; b: string; prompt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();

  const modelA = store.aiModels.find((m) => m.id === store.compareModelA)!;
  const modelB = store.aiModels.find((m) => m.id === store.compareModelB)!;

  const handleCompare = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);
    // Simulate responses with different latencies
    const responseA = simulateCompareResponse(input, modelA.id);
    const responseB = simulateCompareResponse(input, modelB.id);
    const latencyA = modelA.id.includes('flash') ? 800 : 1800;
    const latencyB = modelB.id.includes('flash') ? 800 : 1800;

    setTimeout(() => {
      setResults({ a: responseA, b: '', prompt: input.trim() });
      setTimeout(() => {
        setResults({ a: responseA, b: responseB, prompt: input.trim() });
        setLoading(false);
      }, Math.abs(latencyA - latencyB));
    }, Math.min(latencyA, latencyB));
    setInput('');
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1">Compare Models</h2>
        <p className="text-sm text-nexus-muted">Send one prompt, see responses from two models side-by-side</p>
      </div>

      {/* Model selectors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[{ model: modelA, set: 'a' }, { model: modelB, set: 'b' }].map(({ model, set }) => (
          <div key={set} className="rounded-xl bg-nexus-card border border-nexus-border p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
              <select
                value={set === 'a' ? store.compareModelA : store.compareModelB}
                onChange={(e) => {
                  if (set === 'a') store.setCompareModels(e.target.value, store.compareModelB);
                  else store.setCompareModels(store.compareModelA, e.target.value);
                }}
                className="bg-transparent text-sm font-medium flex-1 outline-none"
              >
                {store.aiModels.filter((m) => !m.id.includes('nano') && !m.id.includes('veo')).map((m) => (
                  <option key={m.id} value={m.id} className="bg-nexus-surface">{m.name}</option>
                ))}
              </select>
            </div>
            <div className="text-xs text-nexus-muted">{model.description}</div>
          </div>
        ))}
      </div>

      {/* Prompt input */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
          placeholder="Enter a prompt to compare..."
          className="flex-1 bg-nexus-card rounded-xl px-4 py-2.5 text-sm placeholder:text-nexus-muted"
        />
        <button
          onClick={handleCompare}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium disabled:opacity-30"
        >
          Compare
        </button>
      </div>

      {/* Results */}
      {(results || loading) && (
        <div className="grid grid-cols-2 gap-3">
          {[{ content: results?.a, model: modelA }, { content: results?.b, model: modelB }].map((r, i) => (
            <div key={i} className="rounded-xl bg-nexus-card border border-nexus-border p-3 min-h-[200px]">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-nexus-border">
                <div className="w-2 h-2 rounded-full" style={{ background: r.model.color }} />
                <span className="text-xs font-medium">{r.model.name}</span>
              </div>
              {r.content ? (
                <div className="text-xs leading-relaxed whitespace-pre-wrap">{r.content}</div>
              ) : (
                <div className="flex gap-1 mt-4">
                  <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function simulateCompareResponse(prompt: string, modelId: string): string {
  const isFlash = modelId.includes('flash');
  const prefix = isFlash ? '⚡ Quick response:\n\n' : '🧠 Deep analysis:\n\n';
  if (prompt.toLowerCase().includes('poem')) {
    return prefix + 'In circuits deep where data flows,\nA spark of thought in silence grows.\nThe code hums soft, a whispered song,\nOf logic right and reasoning wrong.';
  }
  if (prompt.toLowerCase().includes('code')) {
    return prefix + 'Here\'s a clean implementation:\n\n```js\nconst result = items\n  .filter(x => x.valid)\n  .map(x => transform(x));\n```\n\nFunctional and readable.';
  }
  return prefix + `Based on your prompt: "${prompt.slice(0, 60)}..."\n\nThis is a simulated response from ${modelId}. The actual model would provide a detailed, contextual answer with reasoning tailored to its training and capabilities. ${isFlash ? 'Flash models prioritize speed.' : 'Pro models prioritize depth.'}`;
}

// ─── Media Mode ────────────────────────────────────────
function MediaMode() {
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const store = useStore();
  const nanoModel = store.aiModels.find((m) => m.id === 'nano-banana')!;

  const handleGenerate = () => {
    if (!input.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      store.generateImage(input.trim());
      setGenerating(false);
      setInput('');
    }, 2000);
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: nanoModel.color }} />
          <h2 className="text-lg font-bold">Generate Media</h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${nanoModel.color}22`, color: nanoModel.color }}>
            {nanoModel.badge}
          </span>
        </div>
        <p className="text-sm text-nexus-muted">Create images with AI — powered by Nano Banana</p>
      </div>

      {/* Prompt input */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="A serene mountain landscape at sunset..."
          className="flex-1 bg-nexus-card rounded-xl px-4 py-2.5 text-sm placeholder:text-nexus-muted"
        />
        <button
          onClick={handleGenerate}
          disabled={!input.trim() || generating}
          className="px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium disabled:opacity-30"
        >
          {generating ? '...' : 'Generate'}
        </button>
      </div>

      {/* Generating state */}
      {generating && (
        <div className="aspect-square rounded-2xl bg-nexus-card border border-nexus-border flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-spin inline-block">🎨</div>
            <p className="text-sm text-nexus-muted">Generating image...</p>
          </div>
        </div>
      )}

      {/* Gallery */}
      {store.generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {store.generatedImages.map((img) => (
            <div key={img.id} className="rounded-2xl overflow-hidden border border-nexus-border animate-fade-in">
              <div className="aspect-square flex items-center justify-center" style={{ background: img.gradient }}>
                <span className="text-5xl">{img.emoji}</span>
              </div>
              <div className="p-2 bg-nexus-card">
                <div className="text-xs font-medium truncate">{img.prompt}</div>
                <div className="text-[10px] text-nexus-muted mt-1">{img.model}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {store.generatedImages.length === 0 && !generating && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎨</div>
          <p className="text-sm text-nexus-muted">No images yet. Describe what you want to create!</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['Sunset over mountains', 'Cyberpunk city street', 'Cute robot character', 'Abstract art with blue tones'].map((s) => (
              <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 rounded-full bg-nexus-card border border-nexus-border text-xs text-nexus-muted">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Live Voice Mode ───────────────────────────────────
function LiveMode() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const phrases = [
    'Hello! How can I help you today?',
    'That\'s interesting. Tell me more.',
    'I understand. Let me think about that.',
    'Great question! Here\'s what I think...',
    'I see what you mean.',
  ];

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate AI response
      setAiResponse(phrases[Math.floor(Math.random() * phrases.length)]);
    } else {
      setIsListening(true);
      setTranscript('');
      setAiResponse('');
      // Simulate user speaking
      setTimeout(() => {
        setTranscript('Hey Gemini, what\'s the weather like today?');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold mb-1">Live Voice</h2>
        <p className="text-sm text-nexus-muted">Real-time voice conversation with Gemini</p>
      </div>

      {/* Waveform / Orb */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={toggleListening}
          className="relative flex items-center justify-center"
          style={{ width: 200, height: 200 }}
        >
          {/* Pulse rings */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full gradient-bg opacity-20 animate-ping" />
              <div className="absolute inset-4 rounded-full gradient-bg opacity-30 animate-pulse" />
            </>
          )}
          <div
            className={`relative flex items-center justify-center rounded-full transition-all ${
              isListening ? 'gradient-bg scale-110' : 'bg-nexus-card border-2 border-nexus-border'
            }`}
            style={{ width: 120, height: 120 }}
          >
            {/* Waveform bars */}
            {isListening ? (
              <div className="flex items-end gap-1 h-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    style={{
                      height: `${30 + Math.sin(Date.now() / 200 + i) * 40 + 40}%`,
                      animation: `wave 0.6s ease-in-out ${i * 0.1}s infinite`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <svg className="w-12 h-12 text-nexus-text" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 18v3M12 1v3M4 11a8 8 0 0116 0" />
                <rect x="9" y="11" width="6" height="8" rx="3" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="w-full mt-6 p-3 rounded-xl bg-nexus-card border border-nexus-border">
          <div className="text-xs text-nexus-muted mb-1">You said:</div>
          <div className="text-sm">{transcript}</div>
        </div>
      )}
      {aiResponse && (
        <div className="w-full mt-3 p-3 rounded-xl gradient-bg">
          <div className="text-xs text-white/50 mb-1">Gemini:</div>
          <div className="text-sm text-white">{aiResponse}</div>
        </div>
      )}

      <div className="mt-6 text-xs text-nexus-muted text-center">
        {isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}
      </div>
      <style>{`@keyframes wave { 0%,100% { height: 20%; } 50% { height: 80%; } }`}</style>
    </div>
  );
}

// ─── URL Context Mode ──────────────────────────────────
function URLMode() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setSummary('');
    setTimeout(() => {
      setSummary(`I've retrieved and analyzed the content from ${url}.\n\n**Summary:**\n• The page appears to be a web resource with relevant content\n• Key topics include the main subject matter and supporting details\n• The content is structured for readability\n\n**Key Takeaways:**\n1. The primary focus is on delivering value to the reader\n2. Supporting evidence reinforces the main points\n3. The page includes navigation and calls to action\n\n*Note: This is a simulation. In production, the URL Context tool would fetch and analyze real page content.*`);
      setLoading(false);
    }, 1500);
    setUrl('');
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1">URL Context</h2>
        <p className="text-sm text-nexus-muted">Paste a URL and let AI read and summarize it</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          placeholder="https://example.com/article"
          className="flex-1 bg-nexus-card rounded-xl px-4 py-2.5 text-sm placeholder:text-nexus-muted"
        />
        <button
          onClick={handleAnalyze}
          disabled={!url.trim() || loading}
          className="px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium disabled:opacity-30"
        >
          {loading ? '...' : 'Analyze'}
        </button>
      </div>

      {loading && (
        <div className="p-4 rounded-xl bg-nexus-card border border-nexus-border flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-nexus-muted animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="text-sm text-nexus-muted">Fetching and analyzing content...</span>
        </div>
      )}

      {summary && (
        <div className="p-4 rounded-xl bg-nexus-card border border-nexus-border">
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-nexus-text">{summary}</div>
        </div>
      )}

      {!loading && !summary && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔗</div>
          <p className="text-sm text-nexus-muted">Paste any URL to get an AI-powered summary</p>
        </div>
      )}
    </div>
  );
}

// ─── Usage Dashboard ───────────────────────────────────
function UsageMode() {
  const store = useStore();
  const totalRpm = store.aiModels.reduce((sum, m) => sum + m.rpm, 0);
  const totalRpd = store.aiModels.reduce((sum, m) => sum + m.rpd, 0);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1">Rate Limits & Usage</h2>
        <p className="text-sm text-nexus-muted">Monitor your API usage across all models</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-4 rounded-xl bg-nexus-card border border-nexus-border">
          <div className="text-xs text-nexus-muted">Total tokens used</div>
          <div className="text-2xl font-bold font-mono mt-1">{store.totalTokensUsed.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-nexus-card border border-nexus-border">
          <div className="text-xs text-nexus-muted">Est. cost</div>
          <div className="text-2xl font-bold font-mono mt-1">${store.totalEstimatedCost.toFixed(4)}</div>
        </div>
      </div>

      {/* Per-model breakdown */}
      <div className="space-y-2">
        {store.aiModels.map((m) => (
          <div key={m.id} className="p-3 rounded-xl bg-nexus-card border border-nexus-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <span className="text-sm font-medium flex-1">{m.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${m.color}22`, color: m.color }}>
                {m.badge}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-nexus-muted">RPM</div>
                <div className="font-mono font-medium">{m.rpm.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-nexus-muted">TPM</div>
                <div className="font-mono font-medium">{m.tpm > 0 ? m.tpm.toLocaleString() : '—'}</div>
              </div>
              <div>
                <div className="text-nexus-muted">RPD</div>
                <div className="font-mono font-medium">{m.rpd.toLocaleString()}</div>
              </div>
            </div>
            {/* Usage bar */}
            <div className="mt-2 h-1 rounded-full bg-nexus-surface overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((store.usageRpm / m.rpm) * 100, 100)}%`,
                  background: m.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-nexus-card border border-nexus-border text-xs text-nexus-muted">
        💡 This is a simulation. In production, these limits would be enforced by the Gemini API. Upgrade to a paid tier for higher limits.
      </div>
    </div>
  );
}
