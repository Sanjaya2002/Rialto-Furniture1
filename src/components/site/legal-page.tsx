import { PageHeader } from "@/components/site/page-header";

export function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="container grid gap-10 border-t pb-24 pt-12 md:pb-36 lg:grid-cols-12">
        <div className="prose-editorial lg:col-span-8 lg:col-start-4">{children}</div>
      </div>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
