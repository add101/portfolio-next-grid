'use client';

import { useEffect, useRef, useState } from 'react';

const items = [
  { title: 'UE Prototype 01', tag: 'Realtime / UE', ratio: '4/5', image: '01  3D Rendering - House Zero - Queenswood Pretoria.jpg', desc: 'Placeholder note — realtime prototype details go here once the reel is cut.' },
  { title: 'WebXR Study', tag: 'Web3D', ratio: '1/1', image: '01-Holborn-Gate-Reception.jpg', desc: 'Placeholder note for a browser-based interactive piece.' },
  { title: 'Interior Vis 04', tag: 'Visualisation', ratio: '3/4', image: '02 3D Rendering - House Zero - House Ivy - Pretoria.jpg', desc: 'Placeholder note for an architectural visualisation still.' },
  { title: 'Animation Test', tag: 'Realtime / UE', ratio: '16/9', image: '03 3D Rendering Office Library - London.jpg', desc: 'Placeholder note for a realtime animation clip.' },
  { title: 'R3F Experiment', tag: 'Web3D', ratio: '4/3', image: '04_3D Visualisation - Renderings of Waterford Estate - Dunkeld.jpg', desc: 'Placeholder note for a React Three Fiber build.' },
  { title: 'Product Vis 02', tag: 'Visualisation', ratio: '1/1', image: '05 3D Visualisation - SBE Architects Renovation - Front Render.jpg', desc: 'Placeholder note for a product visualisation render.' },
  { title: 'VR Environment', tag: 'Realtime / UE', ratio: '3/4', image: '06 3D Visualisation - SBE Architects Renovation - Garden Boma Pool  Render.jpg', desc: 'Placeholder note for a VR environment prototype.' },
  { title: 'Shader Study', tag: 'Web3D', ratio: '4/5', image: '08 3D Rendering - Canteen Renovation Nottingham.jpg', desc: 'Placeholder note for a WebGL shader experiment.' },
  { title: 'Exterior Vis 01', tag: 'Visualisation', ratio: '16/9', image: '09 3D Rendering - Office Interior Renovation - Bryanston -Johannesburg.jpg', desc: 'Placeholder note for an exterior architectural render.' },
];

export default function MasonryGallery() {
  const [active, setActive] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const closeRef = useRef(null);

  function openItem(it) {
    setActive(it);
    setInfoOpen(false);
  }
  function close() {
    setActive(null);
  }

  useEffect(() => {
    if (active) closeRef.current?.focus();
  }, [active]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') close();
    }
    if (active) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <div className="masonry">
        {items.map((it) => (
          <div
            key={it.title}
            className="g-item"
            tabIndex={0}
            role="button"
            aria-label={`${it.title} — view details`}
            onClick={() => openItem(it)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openItem(it);
              }
            }}
          >
            <img
              className="g-ph"
              src={encodeURI(`/images/${it.image}`)}
              alt={it.title}
              style={{ aspectRatio: it.ratio, objectFit: 'cover', padding: 0 }}
            />
            <div className="g-meta">
              <h3>{it.title}</h3>
              <span className="info-dot" aria-hidden="true">i</span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`modal-overlay${active ? ' open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        {active && (
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <img
              className="modal-ph"
              src={encodeURI(`/images/${active.image}`)}
              alt={active.title}
              style={{ objectFit: 'cover' }}
            />
            <div className="modal-body">
              <div className="modal-head">
                <div className="modal-title-row">
                  <h2 id="modal-title">{active.title}</h2>
                  <button className="info-dot" aria-label="Show details" onClick={() => setInfoOpen((o) => !o)}>
                    i
                  </button>
                </div>
                <button ref={closeRef} className="modal-close" aria-label="Close" onClick={close}>
                  ×
                </button>
              </div>
              <span className="modal-tag">{active.tag}</span>
              <div className={`modal-info${infoOpen ? ' open' : ''}`}>
                <p>{active.desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
