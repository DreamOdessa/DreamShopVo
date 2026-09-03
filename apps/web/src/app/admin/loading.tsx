export default function AdminLoading() {
  return (
    <main aria-busy="true" aria-label="Завантаження адмін-панелі" className="admin-page route-loading admin-route-loading">
      <div className="route-loading-heading" />
      <div className="route-loading-admin-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="route-loading-panel" key={index} />
        ))}
      </div>
    </main>
  );
}
