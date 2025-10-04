import React from 'react';

const ContactCta = () => {
  return (
    <section className="bg-primary-black py-24 md:py-40">
      <div className="container">
        <a href="/contact" className="no-underline">
          <h2 className="font-display text-center font-bold uppercase text-accent-beige leading-[0.95] tracking-[0.05em] text-[clamp(4.5rem,15vw,12.5rem)] break-words">
            GET IN TOUCH
          </h2>
        </a>
      </div>
    </section>
  );
};

export default ContactCta;