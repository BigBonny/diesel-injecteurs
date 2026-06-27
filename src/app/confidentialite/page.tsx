import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Politique de confidentialité – Diesel Turbo Injection',
  description: 'Politique de confidentialité et protection des données personnelles de Diesel Turbo Injection.',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <section className="relative py-16 bg-[#1e2a4a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-6">
            <Lock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm font-medium">Protection des données</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Politique de confidentialité</h1>
          <p className="text-slate-400 mt-4 text-sm">Conforme au RGPD – En vigueur au 1er janvier 2025</p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">1. Responsable du traitement</h2>
          <div className="space-y-2 text-slate-700">
            <p><span className="font-semibold">Raison sociale :</span> Diesel Turbo Injection</p>
            <p><span className="font-semibold">SIRET :</span> 848 214 359 00012</p>
            <p><span className="font-semibold">Téléphone :</span>{' '}
              <a href="tel:+33172517665" className="text-yellow-600 hover:underline">01 72 51 76 65</a>
            </p>
            <p><span className="font-semibold">Email :</span>{' '}
              <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a>
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">2. Données collectées</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Nous collectons les données personnelles suivantes :</p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Données d'identité :</span> nom, prénom</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Données de contact :</span> adresse email, numéro de téléphone, adresse postale de livraison</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Données de transaction :</span> détail des commandes, historique d'achat</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Données de navigation :</span> adresse IP, cookies, pages visitées, durée de visite</span></li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">3. Finalités du traitement</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Vos données sont utilisées pour :</p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Traiter et expédier vos commandes</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Gérer la relation client et le service après-vente</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Envoyer des confirmations de commande et notifications de livraison</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Améliorer nos services et l'expérience sur notre site</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Envoyer des offres commerciales (avec votre consentement)</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Respecter nos obligations légales et fiscales</span></li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">4. Base légale du traitement</h2>
          <p className="text-slate-700 leading-relaxed">
            Le traitement de vos données repose sur les bases légales suivantes : l'exécution du contrat de vente (traitement des commandes), le respect d'obligations légales (facturation, comptabilité), notre intérêt légitime (amélioration de nos services, sécurité), et votre consentement explicite (communications marketing).
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">5. Durée de conservation</h2>
          <p className="text-slate-700 leading-relaxed">
            Vos données sont conservées pendant la durée nécessaire à l'accomplissement des finalités décrites ci-dessus. Les données de commande sont conservées 5 ans à des fins comptables conformément à la réglementation française. Les données de navigation sont conservées 13 mois maximum.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">6. Partage des données</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Nos transporteurs (La Poste, DPD, Chronopost) pour la livraison</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Nos prestataires de paiement (Stripe, PayPal) pour la sécurisation des transactions</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span>Les autorités compétentes en cas d'obligation légale</span></li>
          </ul>
        </section>

        <section id="cookies" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">7. Cookies</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Nous utilisons notamment :
          </p>
          <ul className="space-y-2 text-slate-700 mb-4">
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Cookies essentiels :</span> nécessaires au fonctionnement du site (panier, session)</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Cookies analytiques :</span> Google Analytics (mesure d'audience)</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Cookies de conversion :</span> Google Tag Manager (suivi des conversions publicitaires)</span></li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Vous pouvez paramétrer votre navigateur pour refuser les cookies non essentiels à tout moment.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">8. Vos droits</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Conformément au RGPD (Règlement Général sur la Protection des Données) et à la loi Informatique et Libertés, vous disposez des droits suivants :
          </p>
          <ul className="space-y-2 text-slate-700 mb-6">
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Droit d'accès :</span> obtenir une copie de vos données personnelles</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Droit de rectification :</span> corriger des données inexactes</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Droit à l'effacement :</span> demander la suppression de vos données</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Droit à la portabilité :</span> recevoir vos données dans un format structuré</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Droit d'opposition :</span> vous opposer au traitement à des fins de prospection</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-1">•</span><span><span className="font-semibold">Droit à la limitation :</span> restreindre l'utilisation de vos données</span></li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Pour exercer ces droits, contactez-nous par email à{' '}
            <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a>{' '}
            ou par téléphone au{' '}
            <a href="tel:+33172517665" className="text-yellow-600 hover:underline">01 72 51 76 65</a>.
            Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> (cnil.fr).
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">9. Sécurité</h2>
          <p className="text-slate-700 leading-relaxed">
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction. Notre site est sécurisé par un certificat SSL/TLS (protocole HTTPS). Les données de paiement sont traitées par des prestataires certifiés PCI-DSS.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">10. Modifications</h2>
          <p className="text-slate-700 leading-relaxed">
            Nous nous réservons le droit de modifier la présente politique à tout moment. La date de la dernière mise à jour est indiquée en haut de cette page. Nous vous encourageons à la consulter régulièrement.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
