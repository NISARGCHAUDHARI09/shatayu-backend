// Utility to get pharmacy bill header/footer from localStorage (as set by Setup module)
export function getPharmacyBillHeaderFooter() {
  let header = 'Ayurveda Pharmacy\n123 Herbal Lane, Wellness City\nPh: 9876543210 | GSTIN: 22AAAAA0000A1Z5';
  let footer = 'Thank you for choosing Ayurveda Pharmacy!';
  try {
    const setup = JSON.parse(localStorage.getItem('printTemplates'));
    if (setup && setup['pharmacy-bill']) {
      if (setup['pharmacy-bill'].headerImage) header = setup['pharmacy-bill'].headerImage;
      if (setup['pharmacy-bill'].footerContent) footer = setup['pharmacy-bill'].footerContent;
    }
  } catch {}
  return { header, footer };
}
