import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import ContactForm from '../components/forms/ContactForm.jsx';
import site from '../content/site.json';

// /contact?topic=event-listing (from the MICE Window's "List your event") pre-fills the form.
const PRESETS = {
  'event-listing': {
    subject: 'Event listing request: MICE Calendar',
    message: 'Event name:\nDates:\nVenue & city:\nCategory (conference, exhibition, networking…):\nEvent website:\nAnything else we should know:',
  },
};

export default function Contact() {
  const [params] = useSearchParams();
  const topic = params.get('topic');
  const preset = PRESETS[topic];

  return (
    <>
      <Seo title="Contact" description="Get in touch with Summit Sync — Zimbabwe's MICE media and industry platform, based in Harare." />
      <PageHeader eyebrow={preset ? 'MICE Calendar' : 'Get in touch'} title={preset ? 'List Your Event' : 'Contact Us'}>
        {preset
          ? 'Tell us about your conference, exhibition or industry event and we’ll consider it for the Summit Sync MICE Calendar.'
          : 'Planning an event, looking to feature in the magazine, or keen to partner with us? Send us a message.'}
      </PageHeader>

      <section aria-label="Contact details and form" className="container-content section grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
        <address className="flex flex-col gap-5 not-italic">
          <a href={`tel:${site.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-3 hover:text-brand-orange">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
              <Phone size={18} aria-hidden="true" />
            </span>
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-brand-orange">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
              <Mail size={18} aria-hidden="true" />
            </span>
            {site.email}
          </a>
          <p className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
              <MapPin size={18} aria-hidden="true" />
            </span>
            {site.location}
          </p>
        </address>
        {/* key: re-mount with the right preset if the topic changes */}
        <ContactForm key={topic || 'general'} preset={preset} />
      </section>
    </>
  );
}
