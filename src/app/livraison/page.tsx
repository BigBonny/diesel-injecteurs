import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Truck, Clock, MapPin, Package, ShieldCheck, CreditCard, RotateCcw, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Livraison & Retours – Diesel Turbo Injection',
  description: 'Informations sur la livraison, les frais de port, les délais et la politique de retour de Diesel Turbo Injection.',
};

export default function LivraisonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <section className="relative py-16 bg-[#1e2a4a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-6">
            <Truck className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm font-medium">Expédition rapide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Livraison & Retours</h1>
          <p className="text-slate-400 mt-4">Tout ce que vous devez savoir sur nos délais, frais de port et politique de retour</p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        {/* Delivery highlights */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: 'Expédition 24h', desc: 'Commande passée avant 14h expédiée le jour même (jours ouvrés).' },
            { icon: Truck, title: 'Livraison 24-48h', desc: 'En France métropolitaine via FedEx, Colissimo ou Chronopost.' },
            { icon: ShieldCheck, title: 'Suivi inclus', desc: 'Numéro de suivi envoyé par email dès l\'expédition.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Carrier logos */}
        <div className="flex items-center justify-center gap-8 py-4">
          <img src="/assets/Fedex-logo.png" alt="FedEx" className="h-10 object-contain" />
        </div>

        {/* Shipping zones */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-yellow-500" /> Zones de livraison & tarifs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 text-sm font-semibold text-slate-700">Zone</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-slate-700">Délai estimé</th>
                  <th className="py-3 text-sm font-semibold text-slate-700">Frais de port</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 text-sm">
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">France métropolitaine</td>
                  <td className="py-3 pr-4">24 – 48h ouvrées</td>
                  <td className="py-3 font-semibold text-green-600">Gratuit</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">Belgique, Luxembourg</td>
                  <td className="py-3 pr-4">2 – 3 jours ouvrés</td>
                  <td className="py-3 font-semibold text-green-600">Gratuit</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">Allemagne, Pays-Bas</td>
                  <td className="py-3 pr-4">3 – 5 jours ouvrés</td>
                  <td className="py-3 font-semibold text-green-600">Gratuit</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">Espagne, Italie, Portugal</td>
                  <td className="py-3 pr-4">3 – 5 jours ouvrés</td>
                  <td className="py-3 font-semibold text-green-600">Gratuit</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">Autres pays UE</td>
                  <td className="py-3 pr-4">5 – 7 jours ouvrés</td>
                  <td className="py-3">Nous contacter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Packaging */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-yellow-500" /> Emballage & protection
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Toutes nos pièces sont soigneusement emballées dans un carton renforcé avec calage mousse pour garantir une protection optimale pendant le transport. Chaque colis est étiqueté avec un numéro de suivi et assuré contre la casse pendant le transport.
          </p>
        </section>

        {/* Returns */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-yellow-500" /> Politique de retour
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Conformément à l&apos;article L221-18 du Code de la Consommation, vous disposez d&apos;un délai de <strong>14 jours calendaires</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-6">Conditions de retour</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-0.5">•</span> Le produit doit être dans son emballage d&apos;origine, non utilisé et en parfait état.</li>
              <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-0.5">•</span> Contactez-nous par email ou téléphone pour obtenir un numéro de retour.</li>
              <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-0.5">•</span> Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou erreur de notre part.</li>
              <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-0.5">•</span> Le remboursement est effectué sous 14 jours après réception et vérification du produit retourné.</li>
            </ul>
            <h3 className="text-lg font-semibold text-slate-900 mt-6">Produit défectueux ou non conforme</h3>
            <p>
              Si vous recevez un produit défectueux ou non conforme à votre commande, contactez-nous immédiatement. Les frais de retour seront pris en charge par Diesel Turbo Injection et un remplacement ou remboursement sera effectué dans les plus brefs délais.
            </p>
          </div>
        </section>

        {/* Payment methods */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-yellow-500" /> Moyens de paiement acceptés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Carte Bancaire (CB, Visa, Mastercard)', 'PayPal', 'Virement bancaire', 'Paiement en 3x sans frais'].map((method, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-slate-700">{method}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Toutes les transactions sont sécurisées par certificat SSL. Vos données bancaires ne sont jamais stockées sur nos serveurs.
          </p>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-yellow-500" /> Questions fréquentes
          </h2>
          <div className="space-y-6">
            {[
              { q: 'Puis-je suivre ma commande ?', a: 'Oui, un email contenant votre numéro de suivi vous est envoyé dès l\'expédition de votre colis.' },
              { q: 'Que faire si mon colis est endommagé à la réception ?', a: 'Refusez le colis ou émettez des réserves auprès du transporteur, puis contactez-nous immédiatement avec des photos du colis et du produit.' },
              { q: 'Livrez-vous en dehors de l\'Europe ?', a: 'Nous livrons principalement en France et en Union Européenne. Pour les autres destinations, contactez-nous pour un devis personnalisé.' },
              { q: 'Combien de temps pour recevoir mon remboursement ?', a: 'Le remboursement est effectué sous 14 jours après réception et vérification du produit retourné, sur le même moyen de paiement utilisé lors de la commande.' },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-slate-900 mb-1">{item.q}</h3>
                <p className="text-slate-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200 text-center">
          <p className="text-slate-800 font-medium mb-2">Besoin d&apos;aide ?</p>
          <p className="text-slate-600 text-sm mb-4">Notre équipe est disponible pour répondre à toutes vos questions.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+33612429880" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-xl font-semibold hover:bg-yellow-300 transition text-sm">
              📞 06 12 42 98 80
            </a>
            <a href="mailto:contact@diesel-turbo-injection.com" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition text-sm">
              ✉️ contact@diesel-turbo-injection.com
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
