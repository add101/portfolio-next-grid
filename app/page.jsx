import SolarHero from '@/components/SolarHero';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <SolarHero />

      <section id="capabilities">
        <div className="wrap">
          <div className="section-head">
            <h2>Where I work</h2>
            <span>Three overlapping disciplines</span>
          </div>
          <div className="pillars">
            <div className="pillar">
              <h3>Realtime &amp; VR</h3>
              <p>Realtime art, prototyping and animation for immersive and interactive experiences — from concept to a playable build.</p>
              <div className="tools">Unreal Engine · Unity · WebXR</div>
            </div>
            <div className="pillar">
              <h3>Web3D &amp; Interactive Dev</h3>
              <p>Browser-based 3D and interactive front ends, built to run smoothly and feel considered.</p>
              <div className="tools">React · Next.js · Three.js · R3F</div>
            </div>
            <div className="pillar">
              <h3>Visualisation</h3>
              <p>Architectural and product visualisation, drawing on a background in architectural draughting and design.</p>
              <div className="tools">3ds Max · Sketchup · Blender · V-Ray · Corona</div>
            </div>
          </div>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="section-head">
            <h2>Selected work</h2>
            <span>Reel and case studies in progress</span>
          </div>
          <div className="work-grid">
            <div className="work-card"><span className="tag">VR / Product study</span>Headset concept visualisation</div>
            <div className="work-card"><span className="tag">Web development</span>Interactive digital work</div>
            <div className="work-card"><span className="tag">Visualisation</span>Glamping tent brand</div>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="wrap">
          <div className="section-head">
            <h2>About</h2>
            <span>Architecture → visualisation → realtime</span>
          </div>
          <div className="about">
            <div>
              <p>My path started in architectural draughting, moved through a decade of architectural and product visualisation, and has landed on realtime and interactive work — building worlds you can move through rather than just look at.</p>
              <p>I&rsquo;m drawn to work at the intersection of disciplines, where technical rigor meets thoughtful creativity.</p>
            </div>
            <div>
              <div className="stat"><b>2003 —</b><span>Architectural visualisation, freelance and studio</span></div>
              <div className="stat"><b>2017 —</b><span>Creative Technologist, realtime &amp; web-based work</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="wrap">
          <h2>Open to full-time realtime / creative technologist roles, and select freelance work.</h2>
          <div className="contact-row">
            <a className="btn" href="/contact">Get in touch</a>
            <a className="social" href="https://www.linkedin.com/in/adrian-lamour/">LinkedIn</a>
            <a className="social" href="https://www.behance.net/GrowMotion">Behance</a>
            <a className="social" href="https://www.youtube.com/@add101recreation">YouTube</a>
          </div>
        </div>
      </section>

      <Footer label="Homepage concept, v1" />
    </main>
  );
}
