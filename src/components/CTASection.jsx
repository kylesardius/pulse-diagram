// TODO: point these at the real Sardius URLs before publishing.
const DEMO_URL = '#book-a-demo';
const DOCS_URL = '#documentation';

export default function CTASection() {
  return (
    <section className="cta" aria-labelledby="cta-heading">
      <h2 className="section-heading" id="cta-heading">
        See Pulse on your own footage
      </h2>
      <div className="cta-actions">
        <a className="button button--primary" href={DEMO_URL}>
          Book a Demo
        </a>
        <a className="button button--secondary" href={DOCS_URL}>
          View Documentation
        </a>
      </div>
    </section>
  );
}
