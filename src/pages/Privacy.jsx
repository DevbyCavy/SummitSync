import Seo from '../components/Seo.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import site from '../content/site.json';

// TODO(open): template wording — have the client review it (including against Zimbabwe's
// Cyber and Data Protection Act) and confirm the contact email and "last updated" date.
const LAST_UPDATED = '30 October 2026';

const SECTIONS = [
  {
    title: 'What we collect',
    body: [
      'We only collect the information you choose to send us through the forms on this website:',
      'Newsletter: your email address.',
      'Contact form: your name, email address and message, and optionally your phone number, organisation and subject.',
      'Industry network sign-up: your name, email address, and optionally your organisation and role.',
      'For security and spam prevention we also record the IP address a form was submitted from.',
    ],
  },
  {
    title: 'How we use it',
    body: [
      'To send you the newsletter you subscribed to, to reply to your enquiry, and to contact you about joining the Summit Sync industry network. We do not sell or rent your personal information to anyone.',
    ],
  },
  {
    title: 'How it is stored',
    body: [
      'Submissions are stored in a secure database on our web host and contact enquiries are forwarded to our team by email. We keep your information only for as long as it is needed for these purposes.',
    ],
  },
  {
    title: 'Cookies',
    body: ['This website does not use advertising or tracking cookies.'],
  },
  {
    title: 'Your choices',
    body: [
      `You can unsubscribe from the newsletter at any time, or ask us to see, correct or delete the information we hold about you by emailing ${site.email}.`,
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How Summit Sync collects, uses and protects the information you share through this website." />
      <PageHeader eyebrow="Legal" title="Privacy Policy">
        Last updated {LAST_UPDATED}.
      </PageHeader>

      <section aria-label="Privacy policy" className="container-content section">
        <div className="max-w-3xl space-y-10">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-2xl font-normal text-white">{title}</h2>
              {body.map((para) => (
                <p key={para} className="mt-3 leading-relaxed text-white/70">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
