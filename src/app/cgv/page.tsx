import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Conditions Générales de Vente – Diesel Injecteurs',
  description: 'Conditions générales de vente de Diesel Injecteurs. SIRET 848 214 359 00012.',
};

export default function CGVPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <section className="relative py-16 bg-[#1e2a4a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-6">
            <FileText className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm font-medium">Vente en ligne</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Conditions Générales de Vente</h1>
          <p className="text-slate-400 mt-4 text-sm">En vigueur au 1er janvier 2025</p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">1. Identification du vendeur</h2>
          <div className="space-y-2 text-slate-700">
            <p><span className="font-semibold">Raison sociale :</span> Diesel Injecteurs</p>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">2. Objet</h2>
          <p className="text-slate-700 leading-relaxed">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Diesel Injecteurs et toute personne physique ou morale (ci-après « le Client ») souhaitant effectuer un achat via le site <strong>diesel-turbo-injection.com</strong>. Tout achat implique l'acceptation sans réserve des présentes CGV.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">3. Produits</h2>
          <p className="text-slate-700 leading-relaxed">
            Les produits proposés à la vente sont des pièces automobiles diesel (turbos, injecteurs, pompes à injection, kits de réparation) neuves ou reconditionnées. Les caractéristiques essentielles de chaque produit sont décrites sur leurs fiches produits respectives. Les photographies sont fournies à titre indicatif et ne sont pas contractuelles.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">4. Prix</h2>
          <p className="text-slate-700 leading-relaxed">
            Les prix sont indiqués en euros toutes taxes comprises (TTC). Diesel Injecteurs se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés au tarif en vigueur au moment de la validation de la commande. Les frais de livraison sont indiqués lors du processus de commande avant validation définitive.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">5. Commande</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Le Client passe commande en ligne depuis le site diesel-turbo-injection.com. La commande n'est définitive qu'après confirmation du paiement. Un email de confirmation est envoyé au Client à l'adresse fournie lors de la commande.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Diesel Injecteurs se réserve le droit d'annuler toute commande d'un Client avec lequel existerait un litige relatif au paiement d'une commande antérieure, ou en cas de rupture de stock imprévue.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">6. Paiement</h2>
          <p className="text-slate-700 leading-relaxed">
            Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard, CB) ou PayPal. Un paiement en 3 fois sans frais est disponible sous conditions. Toutes les transactions sont sécurisées par cryptage SSL. Les données bancaires du Client ne sont pas conservées par Diesel Injecteurs.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">7. Livraison</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Les produits sont expédiés en France métropolitaine et dans l'Union Européenne. Le délai de livraison standard est de 24 à 48 heures ouvrées à compter de la validation du paiement (hors week-ends et jours fériés). Les commandes passées avant 14h les jours ouvrés sont expédiées le jour même.
          </p>
          <p className="text-slate-700 leading-relaxed">
            En cas de retard de livraison imputable au transporteur, Diesel Injecteurs ne saurait être tenu responsable. Le Client peut suivre sa commande grâce au numéro de suivi fourni par email.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">8. Droit de rétractation</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Conformément à l'article L221-18 du Code de la Consommation, le Client dispose d'un délai de <strong>14 jours calendaires</strong> à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Pour exercer ce droit, le Client doit notifier sa décision par email à <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a> ou par téléphone au <a href="tel:+33172517665" className="text-yellow-600 hover:underline">01 72 51 76 65</a>. Le produit devra être retourné dans son état et emballage d'origine. Les frais de retour sont à la charge du Client sauf en cas de produit défectueux.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">9. Garantie</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Tous les produits bénéficient d'une garantie commerciale de <strong>2 ans</strong> couvrant les défauts de fabrication et de conformité. Cette garantie s'applique à compter de la date de livraison. Elle ne couvre pas les dommages résultant d'une mauvaise installation, d'une utilisation inadéquate ou d'une usure normale.
          </p>
          <p className="text-slate-700 leading-relaxed">
            En cas de panne couverte par la garantie, Diesel Injecteurs procédera au remplacement ou au remboursement du produit défectueux. Pour toute demande de garantie, contactez-nous au <a href="tel:+33172517665" className="text-yellow-600 hover:underline">01 72 51 76 65</a> ou à <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a>.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">10. Consigne</h2>
          <p className="text-slate-700 leading-relaxed">
            Certains produits reconditionnés sont soumis à un système de consigne. Le montant de la consigne est indiqué sur la fiche produit. Le Client s'engage à retourner l'ancienne pièce (le « cœur ») dans un délai de 30 jours après réception du produit. La consigne est remboursée après réception et vérification de la pièce retournée. La pièce retournée doit être complète et non endommagée (hors usure normale).
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">11. Données personnelles</h2>
          <p className="text-slate-700 leading-relaxed">
            Les données personnelles collectées lors de la commande sont utilisées exclusivement pour le traitement et le suivi des commandes. Elles ne sont jamais cédées à des tiers à des fins commerciales. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant <a href="mailto:diesel.injecteurs@gmail.com" className="text-yellow-600 hover:underline">diesel.injecteurs@gmail.com</a>.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">12. Litiges</h2>
          <p className="text-slate-700 leading-relaxed">
            En cas de litige, le Client peut recourir à la médiation de la consommation conformément à l'article L612-1 du Code de la consommation. Les présentes CGV sont soumises au droit français. À défaut de résolution amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
