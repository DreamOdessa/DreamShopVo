export default function AccountLoading() {
  return (
    <main aria-busy="true" aria-label="Завантаження акаунта" className="account-page account-loading route-loading">
      <div className="route-loading-account">
        <div className="route-loading-heading" />
        <div className="route-loading-panel" />
        <div className="route-loading-panel" />
      </div>
    </main>
  );
}
