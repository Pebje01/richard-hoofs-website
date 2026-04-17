// Definieer per pagina welke velden bewerkbaar zijn.
// selector: CSS-selector naar het element in de HTML
// index:    bij meerdere matches, welk element (0 = eerste)
// type:     'text' (1 regel) | 'textarea' (meerdere regels) | 'image' (afbeelding src)

module.exports = {

  index: {
    label: 'Homepage',
    sections: [
      {
        label: 'Hero',
        fields: [
          { id: 'hero_titel',        label: 'Hoofdtitel',            selector: '.hero-text h1',       index: 0, type: 'text' },
          { id: 'hero_beschrijving', label: 'Beschrijving',          selector: '.hero-text .hero-desc', index: 0, type: 'textarea' },
          { id: 'hero_citaat',       label: 'Citaat (cursief blok)', selector: '.hero-text .hero-desc', index: 1, type: 'textarea' }
        ]
      },
      {
        label: 'Individueel consult',
        fields: [
          { id: 'consult_label',        label: 'Label (klein)', selector: '#tarieven .consult-grid .pricing-label',    index: 0, type: 'text' },
          { id: 'consult_titel',        label: 'Titel',         selector: '#tarieven .consult-grid h3',                index: 0, type: 'text' },
          { id: 'consult_beschrijving', label: 'Beschrijving',  selector: '#tarieven .consult-grid .pricing-desc',     index: 0, type: 'textarea' },
          { id: 'consult_prijs',        label: 'Prijs',         selector: '#tarieven .consult-grid .pricing-price',    index: 0, type: 'text' },
          { id: 'consult_duur',         label: 'Duur',          selector: '#tarieven .consult-grid .pricing-duration', index: 0, type: 'text' }
        ]
      },
      {
        label: 'Marma Ayurvedische Massage',
        fields: [
          { id: 'marma_label',        label: 'Label (klein)', selector: '#tarieven .consult-grid .pricing-label',    index: 1, type: 'text' },
          { id: 'marma_titel',        label: 'Titel',         selector: '#tarieven .consult-grid h3',                index: 1, type: 'text' },
          { id: 'marma_beschrijving', label: 'Beschrijving',  selector: '#tarieven .consult-grid .pricing-desc',     index: 1, type: 'textarea' },
          { id: 'marma_prijs',        label: 'Prijs',         selector: '#tarieven .consult-grid .pricing-price',    index: 1, type: 'text' },
          { id: 'marma_duur',         label: 'Duur',          selector: '#tarieven .consult-grid .pricing-duration', index: 1, type: 'text' }
        ]
      },
      {
        label: 'Van Vast naar Stroming',
        fields: [
          { id: 'vvs_titel',        label: 'Titel',        selector: '#tarieven .pricing-grid h3',                index: 0, type: 'text' },
          { id: 'vvs_beschrijving', label: 'Beschrijving', selector: '#tarieven .pricing-grid .pricing-desc',     index: 0, type: 'textarea' },
          { id: 'vvs_prijs',        label: 'Prijs',        selector: '#tarieven .pricing-grid .pricing-price',    index: 0, type: 'text' },
          { id: 'vvs_duur',         label: 'Duur',         selector: '#tarieven .pricing-grid .pricing-duration', index: 0, type: 'text' }
        ]
      },
      {
        label: 'Lezen van Lichaam en Energie',
        fields: [
          { id: 'lle_titel',        label: 'Titel',        selector: '#tarieven .pricing-grid h3',                index: 1, type: 'text' },
          { id: 'lle_beschrijving', label: 'Beschrijving', selector: '#tarieven .pricing-grid .pricing-desc',     index: 1, type: 'textarea' },
          { id: 'lle_prijs',        label: 'Prijs',        selector: '#tarieven .pricing-grid .pricing-price',    index: 1, type: 'text' },
          { id: 'lle_duur',         label: 'Duur',         selector: '#tarieven .pricing-grid .pricing-duration', index: 1, type: 'text' }
        ]
      },
      {
        label: 'Bezield Leven op Doktersrecept (groepstraining)',
        fields: [
          { id: 'groep_titel',        label: 'Titel',             selector: '#tarieven .pricing-grid h3',                index: 2, type: 'text' },
          { id: 'groep_beschrijving', label: 'Beschrijving',      selector: '#tarieven .pricing-grid .pricing-desc',     index: 2, type: 'textarea' },
          { id: 'groep_prijs',        label: 'Prijs',             selector: '#tarieven .pricing-grid .pricing-price',    index: 2, type: 'text' },
          { id: 'groep_duur',         label: 'Duur / omschrijving', selector: '#tarieven .pricing-grid .pricing-duration', index: 2, type: 'text' }
        ]
      }
    ]
  },

  over: {
    label: 'Over Richard',
    sections: [
      {
        label: 'Hero',
        fields: [
          { id: 'over_h1',        label: 'Hoofdtitel',   selector: '.about-hero h1',           index: 0, type: 'text' },
          { id: 'over_intro',     label: 'Intro-tekst',  selector: '.about-hero-intro',        index: 0, type: 'textarea' }
        ]
      },
      {
        label: 'Bio',
        fields: [
          { id: 'over_bio_titel', label: 'Titel (h2)',   selector: '.bio-section h2',          index: 0, type: 'text' }
        ]
      },
      {
        label: 'Spreker-sectie',
        fields: [
          { id: 'spreker_titel', label: 'Titel',         selector: '.about-speaker h2',        index: 0, type: 'text' }
        ]
      }
    ]
  },

  coaching: {
    label: 'Trajecten',
    sections: [
      {
        label: 'Hero',
        fields: [
          { id: 'coaching_h1',    label: 'Hoofdtitel',   selector: 'h1',                       index: 0, type: 'text' },
          { id: 'coaching_intro', label: 'Intro-tekst',  selector: '.hero-intro',              index: 0, type: 'textarea' }
        ]
      }
    ]
  },

  behandelingen: {
    label: 'Behandelingen',
    sections: [
      {
        label: 'Hero',
        fields: [
          { id: 'beh_h1',    label: 'Hoofdtitel', selector: 'h1',          index: 0, type: 'text' },
          { id: 'beh_intro', label: 'Intro',      selector: '.hero-intro', index: 0, type: 'textarea' }
        ]
      }
    ]
  },

  boeken: {
    label: 'Boeken',
    sections: [
      {
        label: 'Hero',
        fields: [
          { id: 'boeken_h1', label: 'Hoofdtitel', selector: 'h1', index: 0, type: 'text' }
        ]
      }
    ]
  },

  contact: {
    label: 'Contact',
    sections: [
      {
        label: 'Hero',
        fields: [
          { id: 'contact_h1', label: 'Hoofdtitel', selector: '.hero-wrap-text h1', index: 0, type: 'text' }
        ]
      },
      {
        label: 'Contactgegevens',
        fields: [
          { id: 'contact_email_waarde',    label: 'E-mailadres',           selector: '.hero-info-grid .hero-info-value', index: 0, type: 'text' },
          { id: 'contact_praktijk_waarde', label: 'Praktijkadres',         selector: '.hero-info-grid .hero-info-value', index: 1, type: 'text' }
        ]
      }
    ]
  }

};
