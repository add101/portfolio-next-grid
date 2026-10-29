import EmailReveal from '@/components/EmailReveal';
import Footer from '@/components/Footer';

export const metadata = { title: 'Contact — Adrian Lamour' };

export default function ContactPage() {
  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <h1>Contact</h1>
          <p>Open to full-time realtime / creative technologist roles, and select freelance work.</p>
        </div>
      </section>

      <section id="social">
        <div className="wrap">
          <div className="section-head">
            <h2>Elsewhere</h2>
            <span>Portfolio &amp; process</span>
          </div>
          <div className="social-tier">
            <a className="social-card" href="https://www.linkedin.com/in/adrian-lamour/" target="_blank" rel="noopener">
              <span className="social-name">LinkedIn</span><span className="social-sub">Professional profile</span>
            </a>
            <a className="social-card" href="https://www.behance.net/GrowMotion" target="_blank" rel="noopener">
              <span className="social-name">Behance</span><span className="social-sub">Portfolio</span>
            </a>
          </div>
          <div className="social-tier">
            <a className="social-card small" href="#" target="_blank" rel="noopener">Twitter / X</a>
            <a className="social-card small" href="#" target="_blank" rel="noopener">Instagram</a>
            <a className="social-card small" href="https://www.youtube.com/@add101recreation" target="_blank" rel="noopener">YouTube</a>
            <a className="social-card small" href="#" target="_blank" rel="noopener">ArtStation</a>
          </div>
        </div>
      </section>

      <section id="get-in-touch">
        <div className="wrap">
          <div className="section-head">
            <h2>Get in touch</h2>
            <span>Email or book a chat</span>
          </div>
          <div className="contact-grid">
            <EmailReveal />
            <div className="contact-block">
              <h3>Book a chat</h3>
              <p className="micro">15–30 min intro call — calendar link coming soon.</p>
              <button className="btn-outline" disabled>Booking link coming soon</button>
            </div>
          </div>
        </div>
      </section>

      <Footer label="Contact, v1" />
    </main>
  );
}
