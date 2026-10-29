import MasonryGallery from '@/components/MasonryGallery';
import Footer from '@/components/Footer';

export const metadata = { title: 'Gallery — Adrian Lamour' };

export default function GalleryPage() {
  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <h1>Gallery</h1>
          <p>A selection of architectural, interior and product visualisation work. Select an image for project details.</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-wrap">
          <MasonryGallery />
        </div>
      </section>

      <Footer label="Gallery, v1" />
    </main>
  );
}
