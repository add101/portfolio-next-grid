'use client';

import { useState } from 'react';

export default function EmailReveal() {
  const [revealed, setRevealed] = useState(false);
  const address = 'hello' + '@' + 'adrianlamour.com';

  return (
    <div className="contact-block">
      <h3>Email</h3>
      <p className="micro">Direct enquiries, collaborations, job opportunities.</p>
      {!revealed ? (
        <button className="btn-outline" onClick={() => setRevealed(true)}>
          Show email address
        </button>
      ) : (
        <p className="email-output">
          <a href={`mailto:${address}`}>{address}</a>
        </p>
      )}
    </div>
  );
}
