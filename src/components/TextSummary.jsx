/**
 * Prose walkthrough of the same pipeline the diagram draws, so the page is
 * understandable without hovering anything.
 */
export default function TextSummary() {
  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 className="section-heading" id="summary-heading">
        The Pulse Workflow
      </h2>
      <p className="summary-body">
        Video sources from each location flow through encoders into Sardius Channels
        (metadata tagging). The Sardius Online Video Platform receives, records, and
        archives content with configurable retention. Asset Storage provides
        searchable, centralized cloud storage. Pulse Viewing Portal delivers approved
        viewers instant access with role-based segmentation, smart feeds, and
        Sardius AI-powered search.
      </p>
    </section>
  );
}
