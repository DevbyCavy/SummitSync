import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, MapPin } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Img from '../ui/Img.jsx';
import IconButton from '../ui/IconButton.jsx';
import { formatDate } from '../../lib/format.js';

export default function ProjectLightbox({ project, onClose }) {
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [project?.id]);

  if (!project) return null;

  const images = [project.cover, ...(project.gallery || [])];
  const step = (dir) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <Modal open onClose={onClose} labelledBy="lightbox-title" className="max-w-4xl">
      <div className="relative">
        <Img
          key={images[index]}
          src={images[index]}
          alt={index === 0 ? `${project.title} — cover photo` : `${project.title} — photo ${index + 1} of ${images.length}`}
          width={1600}
          height={1000}
          sizes="(min-width: 900px) 900px, 100vw"
          className="block h-auto max-h-[60vh] w-full rounded-t-2xl"
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <IconButton solid label="Previous photo" onClick={() => step(-1)}>
              <ArrowLeft size={18} aria-hidden="true" />
            </IconButton>
            <IconButton solid label="Next photo" onClick={() => step(1)}>
              <ArrowRight size={18} aria-hidden="true" />
            </IconButton>
          </div>
        )}
      </div>
      <div className="p-6 sm:p-8">
        <h2 id="lightbox-title" className="text-3xl leading-tight">
          {project.title}
        </h2>
        {(project.date || project.location) && (
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
            {project.date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={16} aria-hidden="true" /> {formatDate(project.date)}
              </span>
            )}
            {project.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} aria-hidden="true" /> {project.location}
              </span>
            )}
          </p>
        )}
        {project.description && <p className="mt-4 leading-relaxed text-white/70">{project.description}</p>}
      </div>
    </Modal>
  );
}
