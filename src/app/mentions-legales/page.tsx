import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Scale } from 'lucide-react';

export const metadata = {
  title: 'Mentions légales – Diesel Turbo Injection',
  description: 'Mentions légales de la société Diesel Turbo Injection, SIRET 848 214 359 00012.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <section className="relative py-16 bg-[#1e2a4a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-6">
            <Scale className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm font-medium">Informations légales</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Mentions légales</h1>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">1. Éditeur du site</h2>
          <div className="space-y-2 text-slate-700">
            <p><span className="font-semibold">Raison sociale :</span> Diesel Turbo Injection</p>
            <p><span className="font-semibold">Forme juridique :</span> Entreprise individuelle</p>
            <p><span className="font-semibold">SIRET :</span> 848 214 359 00012</p>
            <p><span className="font-semibold">Adresse :</span> ZI les Vignes, 5 Rue Bernard, 93000 Bobigny, France</p>
            <p><span className="font-semibold">TVA intracommunautaire :</span> Non assujetti (micro-entreprise)</p>
            <p><span className="font-semibold">Téléphone :</span>{' '}
              <a href="tel:+33172517665" className="text-yellow-600 hover:underline">01 72 51 76 65</a>
            </p>
            <p><span className="font-semibold">WhatsApp :</span>{' '}
              <a href="https://wa.me/33612429880" className="text-yellow-600 hover:underline">06 12 42 98 80</a>
            </p>
            <p><span className="font-semibold">Email :</span>{' '}
              <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a>
            </p>
            <p><span className="font-semibold">Site web :</span>{' '}
              <a href="https://diesel-turbo-injection.com" className="text-yellow-600 hover:underline">diesel-turbo-injection.com</a>
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">2. Hébergement</h2>
          <div className="space-y-2 text-slate-700">
            <p><span className="font-semibold">Hébergeur :</span> Vercel Inc.</p>
            <p><span className="font-semibold">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p><span className="font-semibold">Site :</span>{' '}
              <a href="https://vercel.com" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">3. Propriété intellectuelle</h2>
          <p className="text-slate-700 leading-relaxed">
            L'ensemble du contenu de ce site (textes, images, graphismes, logotypes, icônes, sons, logiciels…) est la propriété exclusive de Diesel Turbo Injection ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou transmission, totale ou partielle, du contenu de ce site, par quelque procédé que ce soit, est interdite sans l'autorisation préalable et écrite de Diesel Turbo Injection.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">4. Responsabilité</h2>
          <p className="text-slate-700 leading-relaxed">
            Diesel Turbo Injection s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, Diesel Turbo Injection ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site. En conséquence, Diesel Turbo Injection décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">5. Données personnelles</h2>
          <p className="text-slate-700 leading-relaxed">
            Les informations collectées sur ce site font l'objet d'un traitement informatique destiné à la gestion des commandes et à la relation client. Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à{' '}
            <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a>.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">6. Cookies</h2>
          <p className="text-slate-700 leading-relaxed">
            Ce site utilise des cookies à des fins statistiques et d'amélioration de l'expérience utilisateur. Vous pouvez paramétrer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient alors ne plus être disponibles.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">7. Droit applicable</h2>
          <p className="text-slate-700 leading-relaxed">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, et après échec de toute tentative de résolution amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
