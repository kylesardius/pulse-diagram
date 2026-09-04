/** Problem/solution framing for the active vertical. */
export default function ProblemSolution({ vertical }) {
  return (
    <div className="statement">
      <div className="statement-block statement-block--problem">
        <p className="statement-label">Problem</p>
        <p className="statement-body">{vertical.problem}</p>
      </div>
      <div className="statement-block statement-block--solution">
        <p className="statement-label">Solution</p>
        <p className="statement-body">{vertical.solution}</p>
      </div>
    </div>
  );
}
