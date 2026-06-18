export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <h1 className="text-xl">Logo</h1>
        <p className="text-sm text-muted-foreground">Feito para os alunos.</p>
        <p className="text-sm text-muted-foreground">
          {"© "}
          {new Date().getFullYear()} Event Hub
        </p>
      </div>
    </footer>
  );
}
