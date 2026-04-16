import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Safety & Handling',
      content: 'All users must ensure that cylinders are handled with extreme care. Sharing is only permitted for cylinders that are verified to be in good condition, without any visible damage or leaks. Users must follow proper storage protocols during transport.'
    },
    {
      title: '2. Resource Sharing Protocols',
      content: 'Resource sharing is a community-driven initiative. Any exchange must be mutually agreed upon via the platform chat. The LPG Hub platform is not responsible for physical transactions but provides the trust infrastructure to verify users.'
    },
    {
      title: '3. Community Trust System',
      content: 'Your Trust Score is a privilege. Misuse of the platform, such as providing false availability information or failing to honor agreed-upon exchanges, will result in a decrease in your Trust Score and potential suspension of access.'
    },
    {
      title: '4. Legal Compliance',
      content: 'Users must comply with all local and national regulations regarding LPG usage and transport. Any illegal resale or prohibited transport of cylinders is strictly against our terms of service.'
    },
    {
      title: '5. Liability Disclaimer',
      content: 'LPG Hub provides the interface for coordination between users. We do not own, sell, or transport cylinders and are not liable for any accidents, damages, or losses occurring during community-led resource sharing.'
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
          <h1 className="text-xl font-bold font-headline text-white">Terms & Conditions</h1>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-headline font-black text-white mb-6">User Agreement</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Welcome to the LPG Sharing System. By using our services, you agree to the following terms and conditions. These terms are designed to ensure safety, trust, and accountability within our community.
          </p>
          <p className="text-xs text-on-surface-variant/60 mt-4 italic">Last Updated: April 16, 2026</p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section, idx) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border-l-2 border-white/5 pl-8 relative"
            >
              <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-white opacity-20"></div>
              <h3 className="text-xl font-headline font-bold text-white mb-4">{section.title}</h3>
              <p className="text-on-surface-variant leading-relaxed font-light">{section.content}</p>
            </motion.section>
          ))}
        </div>

        <section className="mt-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
          <h4 className="text-white font-bold mb-4 italic">"By proceeding, you acknowledge that safety is our collective responsibility."</h4>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors"
          >
            I Accept These Terms
          </button>
        </section>
      </main>
    </div>
  );
};

export default Terms;
