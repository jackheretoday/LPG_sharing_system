import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();

  const supportContacts = [
    {
      provider: 'HP Gas',
      type: 'Customer Support',
      number: '1800-233-3555',
      icon: 'local_gas_station',
      color: 'bg-blue-500'
    },
    {
      provider: 'Bharat Gas',
      type: 'Primary Support',
      number: '8108303255',
      icon: 'gas_meter',
      color: 'bg-orange-500'
    },
    {
      provider: 'Indane Gas',
      type: 'Toll-Free Helpline',
      number: '1800-233-3555',
      icon: 'propane_tank',
      color: 'bg-red-500'
    },
    {
      provider: 'Emergency Helpline',
      type: 'Fire & Leakage',
      number: '1906',
      icon: 'emergency',
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold font-headline text-white">Support Center</h1>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-headline font-black text-white mb-4">How can we help you?</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Contact your LPG provider directly for delivery issues, leakage reports, or account inquiries.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {supportContacts.map((contact, idx) => (
            <motion.div
              key={contact.provider}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="hub-glass glass-edge p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => window.open(`tel:${contact.number.replace(/-/g, '')}`)}
            >
              <div className={`w-14 h-14 rounded-xl ${contact.color}/10 flex items-center justify-center text-white ring-1 ring-white/10 group-hover:ring-white/30 transition-all`}>
                <span className={`material-symbols-outlined !text-3xl text-${contact.color.split('-')[1]}-400`}>{contact.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{contact.provider}</h3>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-2">{contact.type}</p>
                <p className="text-xl font-headline font-black text-white letter-spacing-1">{contact.number}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant">call</span>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-16 pt-16 border-t border-white/5">
          <h3 className="text-2xl font-headline font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              { q: 'How to report a gas leak?', a: 'Immediately shut off the cylinder valve, open all windows, and call the emergency helpline 1906.' },
              { q: 'What to do if delivery is delayed?', a: 'Contact your specific distributor using the numbers listed above with your booking reference ID.' },
              { q: 'How is the Trust Score calculated?', a: 'It is based on your history of successful resource exchanges and positive community feedback.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-surface-container-low p-6 rounded-xl border border-white/5">
                <h4 className="text-white font-bold mb-2">{faq.q}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Support;
