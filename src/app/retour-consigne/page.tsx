'use client';

import Navigation from '@/components/Navigation';
import { Package, Truck, RotateCcw, ShieldCheck, FileText, Phone, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: Package,
    title: 'Achat avec consigne',
    description: 'Effectuez l\'achat d\'une pièce reconditionnée ou neuve sur notre boutique en ligne, incluant une consigne remboursable de 80€.'
  },
  {
    number: '02',
    icon: Truck,
    title: 'Réception et remplacement',
    description: 'Vous recevez votre nouveau produit sous 24/48h (si le produit est en stock). Procédez au remplacement sur votre véhicule.'
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Emballage sécurisé',
    description: 'Emballez soigneusement votre ancienne pièce pour éviter tout dommage pendant le transport. Faites attention aux connecteurs et éléments fragiles.'
  },
  {
    number: '04',
    icon: RotateCcw,
    title: 'Retour avec étiquette',
    description: 'Conservez l\'emballage et collez le bordereau de retour prépayé sur le colis. Envoyez le colis avec l\'étiquette GLS fournie.'
  },
  {
    number: '05',
    icon: Clock,
    title: 'Remboursement 21 jours',
    description: 'Dans un délai maximal de 21 jours après la réception de votre ancienne pièce, un document pour le remboursement de la consigne sera généré.'
  }
];

const importantNotes = [
  {
    icon: AlertCircle,
    title: 'Pièce endommagée',
    content: 'En cas de pièce endommagée lors du transport, le remboursement intégral de l\'acompte ne pourra pas être effectué. Consultez notre document sur les montants déduits.'
  },
  {
    icon: FileText,
    title: 'Photo recommandée',
    content: 'Nous conseillons à nos clients de photographier leur pièce une fois emballée dans le colis, afin d\'éviter tout litige en cas de dommage causé par le transporteur.'
  },
  {
    icon: ShieldCheck,
    title: 'Responsabilité transport',
    content: 'Diesel Injecteurs décline toute responsabilité pour les dégâts imputables au transporteur. Emballez soigneusement pour protéger votre pièce.'
  }
];

export default function RetourConsignePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#fbbf24] via-[#2d4a6f] to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Livraison et retour des pièces</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-4">
              Retour de la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                consigne
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-6 max-w-3xl mx-auto">
              Comment récupérer le montant de votre consigne ? Suivez ces étapes simples pour un remboursement rapide.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Comment procéder ?</h2>
            <p className="text-slate-400">5 étapes simples pour le remboursement de votre consigne</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all">
                <div className="absolute -top-4 -left-2 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>
                <div className="pt-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Points importants</h2>
            <p className="text-slate-400">Informations essentielles pour votre retour</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {importantNotes.map((note, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
                  <note.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{note.title}</h3>
                <p className="text-slate-400 leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Questions fréquentes</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Comment serez-vous remboursé ?</h3>
              <p className="text-slate-400">
                Dans un délai maximal de 21 jours après la réception de votre ancienne pièce, un document pour le remboursement de la consigne sera généré. 
                Une confirmation de remboursement de la consigne vous sera envoyée à l&apos;adresse e-mail utilisée lors de votre commande.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Quel délai pour retourner ma pièce ?</h3>
              <p className="text-slate-400">
                Vous disposez d&apos;un délai d&apos;un mois pour nous retourner votre ancienne pièce après l&apos;achat. 
                Après réception de votre ancienne pièce, nous traiterons le remboursement sous 21 jours maximum.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Que faire si ma pièce est endommagée ?</h3>
              <p className="text-slate-400">
                En cas de pièce endommagée lors du transport, le remboursement intégral de l&apos;acompte ne pourra pas être effectué. 
                Nous vous recommandons vivement de bien emballer votre pièce et de prendre des photos avant l&apos;envoi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl p-8 md:p-12 border border-blue-500/30 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Des questions ?</h2>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                Notre équipe est disponible pour vous aider avec votre retour de consigne.
              </p>
              <a 
                href="tel:+33612429880" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition"
              >
                <Phone className="w-5 h-5" />
                +33 6 12 42 98 80
              </a>
              <p className="text-slate-400 text-sm mt-4">
                LUN-JEU : 9:00-18:00 / VENDREDI : 9:00-16:30
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
