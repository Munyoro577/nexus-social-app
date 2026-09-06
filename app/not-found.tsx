export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="text-6xl mb-4">\ud83d\udc41\u200d\ud83d\udde3</div>
      <h1 className="text-28l font-bold">Page not found</h1>
      <a href="/" className="mt-4 text-sm" style={{ color: 'var(--accent)' }}>Go home</a>
    </div>
  );
}
