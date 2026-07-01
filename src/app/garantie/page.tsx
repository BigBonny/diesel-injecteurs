import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ShieldCheck, Clock, Wrench, CheckCircle, XCircle, Phone, Mail, FileText } from 'lucide-react';

export const metadata = {
  title: 'Garantie 2 Ans – Diesel Turbo Injection',
  description: 'Politique de garantie Diesel Turbo Injection : garantie commerciale de 2 ans sur tous nos turbos, injecteurs et pompes haute pression.',
};

export default function GarantiePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <section className="relative py-16 bg-[#1e2a4a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm font-medium">Sérénité totale</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Garantie 2 Ans</h1>
          <p className="text-slate-400 mt-4">Tous nos produits sont couverts par une garantie commerciale de 2 ans</p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        {/* Highlights */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'Garantie 2 ans', desc: 'Couvre les défauts de fabrication et de conformité sur tous nos produits.' },
            { icon: Wrench, title: 'Remplacement rapide', desc: 'Produit de remplacement expédié sous 24-48h après validation.' },
            { icon: Clock, title: 'Prise en charge rapide', desc: 'Traitement de votre dossier de garantie sous 48h ouvrées.' },
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

        {/* Coverage */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">Ce que couvre la garantie</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Couvert par la garantie
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Défauts de fabrication</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Non-conformité du produit à sa description</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Panne prématurée dans des conditions d&apos;utilisation normales</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Défaut de matériaux</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Problème d&apos;étanchéité (turbos)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Non couvert
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span> Mauvaise installation ou montage incorrect</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span> Utilisation de carburant ou huile non conforme</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span> Usure normale liée à l&apos;utilisation</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span> Dommages causés par un accident ou une négligence</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span> Modification ou altération du produit</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Procedure */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-yellow-500" /> Procédure de garantie
          </h2>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Contactez-nous', desc: 'Appelez-nous au 01 72 51 76 65 ou envoyez un email à diesel.injecteurs@gmail.com avec votre numéro de commande et une description du problème.' },
              { step: '2', title: 'Diagnostic', desc: 'Notre équipe technique évalue votre demande sous 48h et vous indique la marche à suivre (retour du produit ou autre solution).' },
              { step: '3', title: 'Retour du produit', desc: 'Si un retour est nécessaire, nous vous fournissons une étiquette de retour prépayée. Emballez soigneusement le produit.' },
              { step: '4', title: 'Remplacement ou remboursement', desc: 'Après réception et vérification, nous procédons au remplacement du produit (expédition sous 24-48h) ou au remboursement intégral.' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-[#1e2a4a] font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal notice */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">Garantie légale</h2>
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              En plus de la garantie commerciale de 2 ans, vous bénéficiez des garanties légales prévues par le Code de la consommation :
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-0.5">•</span> <strong>Garantie légale de conformité</strong> (articles L217-4 à L217-14 du Code de la consommation) : le vendeur est tenu de livrer un bien conforme au contrat et répond des défauts de conformité existant lors de la délivrance.</li>
              <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold mt-0.5">•</span> <strong>Garantie des vices cachés</strong> (articles 1641 à 1649 du Code civil) : le vendeur est tenu de la garantie à raison des défauts cachés de la chose vendue qui la rendent impropre à l&apos;usage auquel on la destine.</li>
            </ul>
          </div>
        </section>

        <section className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200 text-center">
          <p className="text-slate-800 font-medium mb-2">Une question sur la garantie ?</p>
          <p className="text-slate-600 text-sm mb-4">Notre service après-vente est à votre disposition.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+33172517665" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-xl font-semibold hover:bg-yellow-300 transition text-sm">
              <Phone className="w-4 h-4" /> 01 72 51 76 65
            </a>
            <a href="mailto:diesel.injecteurs@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition text-sm">
              <Mail className="w-4 h-4" /> diesel.injecteurs@gmail.com
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
