export default function StoreLoading() {
  return (
    <main aria-busy="true" aria-label="Завантаження сторінки" className="store-main route-loading">
      <div className="route-loading-heading" />
      <div className="route-loading-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="route-loading-card" key={index} />
        ))}
      </div>
    </main>
  );
}
