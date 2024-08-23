export default function Loading({ text }: { text: string }) {
  return (
    <div className="default_centered vertical">
      <div>Searching {text}...</div>
      <div className="spinner"></div>
    </div>
  );
}
