export const metadata = {
  title: "ibis Styles — Tela de Evento",
};

export default function TelaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {children}
    </div>
  );
}
