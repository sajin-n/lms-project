"use client"

const MainLayout = ({ children, sidebar, navbar, footer }) => (
  <div className="flex flex-col min-h-screen bg-white">
    <header>
      {navbar}
    </header>
    <div className="flex flex-1 w-full">
      <aside>
        {sidebar}
      </aside>
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
    <footer>
      {footer}
    </footer>
  </div>
);

export default MainLayout;
