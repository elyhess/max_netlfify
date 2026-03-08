import img1 from "../img/gallery/537559271_18534893635013456_8827823801066106167_n.jpg";
import img2 from "../img/gallery/538954266_18535626007013456_7142549030697035430_n.jpg";
import img3 from "../img/gallery/539798801_1312522097147426_5573402057859173759_n.jpg";
import img4 from "../img/gallery/541238280_1121443593274203_5440303493025343501_n.jpg";
import img5 from "../img/gallery/542956568_25017381797847783_5370650190011473753_n.jpg";
import img6 from "../img/gallery/628032149_665167290020484_1090471901332782973_n.jpg";

const galleryItems = [
  { id: 1, src: img1, alt: "Colorful beetle tattoo with eye and smiley face" },
  { id: 2, src: img2, alt: "Murakami-style flower tattoo with pixel art" },
  { id: 3, src: img3, alt: "Psychedelic cosmic angel tattoo with wings and yin-yang" },
  { id: 4, src: img4, alt: "Neon scorpion tattoo with smiley face" },
  { id: 5, src: img5, alt: "Retro tech collage tattoo with eyes and computers" },
  { id: 6, src: img6, alt: "Colorful Medusa chest piece with snakes and smiley eyes" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">
            Playful, psychedelic, and unapologetically its own lane
          </p>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div key={item.id} className="gallery-item">
              <img
                src={item.src}
                alt={item.alt}
                className="gallery-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <div className="gallery-cta">
          <a
            href="https://www.instagram.com/maxvktattoos/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon btn-neon-outline"
          >
            See more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
