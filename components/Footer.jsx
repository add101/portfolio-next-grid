export default function Footer({ label }) {
  return (
    <footer>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>Adrian Lamour — Creative Technologist</span>
        <span>{label}</span>
      </div>
    </footer>
  );
}
