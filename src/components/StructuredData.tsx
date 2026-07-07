export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SAS France Injection',
    alternateName: 'Diesel Turbo Injection',
    url: 'https://diesel-turbo-injection.com',
    logo: 'https://diesel-turbo-injection.com/assets/logo.png',
    sameAs: [],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+33-6-12-42-98-80',
        contactType: 'customer service',
        availableLanguage: ['French'],
        areaServed: ['FR', 'BE', 'LU', 'DE', 'ES', 'IT', 'PT', 'NL'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+33-6-12-42-98-80',
        contactType: 'sales',
        availableLanguage: ['French'],
        areaServed: ['FR', 'BE', 'LU', 'DE', 'ES', 'IT', 'PT', 'NL'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '158 Avenue Charles Floquet',
      addressLocality: 'Le Blanc-Mesnil',
      postalCode: '93150',
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    },
    email: 'diesel.injecteurs@gmail.com',
    taxID: '848 214 359 00012',
    foundingDate: '2019-02-11',
    founder: {
      '@type': 'Person',
      name: 'Diaeddine Goubi',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Diesel Turbo Injection',
    url: 'https://diesel-turbo-injection.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://diesel-turbo-injection.com/produits?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'SAS France Injection',
    image: 'https://diesel-turbo-injection.com/assets/logo.png',
    url: 'https://diesel-turbo-injection.com',
    telephone: '+33612429880',
    email: 'diesel.injecteurs@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '158 Avenue Charles Floquet',
      addressLocality: 'Le Blanc-Mesnil',
      postalCode: '93150',
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    },
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Carte Bancaire, PayPal, Virement',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: [
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'Luxembourg' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'Netherlands' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pièces Diesel',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Turbos reconditionnés' },
        { '@type': 'OfferCatalog', name: 'Injecteurs diesel' },
        { '@type': 'OfferCatalog', name: 'Pompes haute pression' },
        { '@type': 'OfferCatalog', name: 'Kits CHRA' },
      ],
    },
  };

  const merchantReturnPolicySchema = {
    '@context': 'https://schema.org',
    '@type': 'MerchantReturnPolicy',
    name: 'Politique de retour Diesel Turbo Injection',
    applicableCountry: 'FR',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    refundType: 'https://schema.org/FullRefund',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(merchantReturnPolicySchema) }}
      />
    </>
  );
}
