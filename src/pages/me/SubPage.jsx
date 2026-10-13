import PageHeader from '../../components/ui/PageHeader';
import PageTransition from '../../components/layout/PageTransition';

/** Shared frame for the pages opened from the Me tab. */
export default function SubPage({ title, children }) {
  return (
    <PageTransition className="screen">
      <div className="scroll">
        <div className="page">
          <PageHeader title={title} back="/app/me" />
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
