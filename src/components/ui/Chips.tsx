export function Chips({ items }: { items: readonly string[] }) {
  return <ul className="chips">{items.map((c) => <li key={c}>{c}</li>)}</ul>;
}
