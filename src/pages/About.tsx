import { motion } from 'motion/react';
import { Shield, Sparkles, Globe, Award, History, Target, Heart } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Shield className="text-luxury-gold" size={24} />,
      title: "Unyielding Integrity",
      description: "We source only the most authentic materials, ensuring every piece in our collection meets the highest standards of provenance and craftsmanship."
    },
    {
      icon: <Sparkles className="text-luxury-gold" size={24} />,
      title: "Refined Aesthetics",
      description: "Our design philosophy is rooted in the balance of classical elegance and contemporary innovation, creating objects that transcend temporal trends."
    },
    {
      icon: <Globe className="text-luxury-gold" size={24} />,
      title: "Global Stewardship",
      description: "Luxury is a responsibility. We commit to sustainable procurement and ethical partnerships across our global logistics network."
    }
  ];

  const milestones = [
    { year: "2018", event: "The inception of LuxeFlow in London's Mayfair district as a bespoke procurement service." },
    { year: "2020", event: "Expansion into the digital realm, bridging traditional craftsmanship with autonomic technology." },
    { year: "2022", event: "Collaborations with independent artisans across Milan, Tokyo, and Zurich launched." },
    { year: "2024", event: "The introduction of the Autonomic Importer Engine, revolutionizing luxury scalability." }
  ];

  return (
    <div className="bg-luxury-black text-white min-h-screen pt-40 pb-32">
      {/* Hero Section */}
      <section className="px-12 max-w-[1400px] mx-auto mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 text-luxury-gold text-[10px] uppercase tracking-[0.5em] mb-8">
            <span className="w-12 h-px bg-luxury-gold"></span>
            The Heritage of LuxeFlow
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light leading-[1.1] tracking-tight mb-12">
            Defining the <span className="italic text-white/40">Future</span> of Elegance.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
            LuxeFlow is more than a boutique; it is a meticulously curated ecosystem dedicated to the preservation of craftsmanship and the pursuit of uncompromising quality.
          </p>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="px-12 max-w-[1400px] mx-auto mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-[#0a0a0a] border border-white/5 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-luxury-gold p-12 text-black hidden lg:block">
              <Award size={48} strokeWidth={1} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-luxury-gold font-mono text-[9px] uppercase tracking-widest">
                <Target size={14} /> Our Mission
              </div>
              <h2 className="text-4xl font-display font-light">To democratize access to the world's most exquisite objects through intelligent curation.</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                We believe that true luxury is found in the story of an object—its origin, the hands that shaped it, and the intent behind its existence. Our mission is to utilize cutting-edge technology to discover and deliver these stories to a global audience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-2xl font-display italic text-white/80">14k+</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">Objects Curated</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-display italic text-white/80">82</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">Global Artisans</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white/[0.02] border-y border-white/5 py-40 mb-40">
        <div className="px-12 max-w-[1400px] mx-auto text-center mb-24">
          <h2 className="text-4xl font-display font-light mb-4">The Pillars of Our Identity</h2>
          <div className="w-12 h-px bg-luxury-gold mx-auto"></div>
        </div>
        <div className="px-12 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {values.map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 1 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full border border-luxury-gold/20 flex items-center justify-center mx-auto mb-8 bg-luxury-gold/5">
                {value.icon}
              </div>
              <h3 className="text-xl font-display font-light italic">{value.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* History Timeline */}
      <section className="px-12 max-w-[1400px] mx-auto mb-40">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3">
             <div className="sticky top-40 space-y-6">
                <div className="flex items-center gap-3 text-luxury-gold font-mono text-[9px] uppercase tracking-widest">
                  <History size={14} /> Our History
                </div>
                <h2 className="text-5xl font-display font-light tracking-tighter">A Journey of <br/>Persistence.</h2>
             </div>
          </div>
          <div className="md:w-2/3 space-y-24">
            {milestones.map((m, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex gap-12 group"
              >
                <div className="text-4xl font-display italic text-luxury-gold/40 group-hover:text-luxury-gold transition-colors duration-700">{m.year}</div>
                <div className="flex-1 pt-2 space-y-4">
                  <div className="h-px bg-white/5 w-12 group-hover:w-full transition-all duration-1000"></div>
                  <p className="text-lg text-gray-300 font-light leading-relaxed">
                    {m.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-12 max-w-[1200px] mx-auto text-center">
        <div className="glass p-24 border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <Heart className="text-luxury-gold/30 mx-auto mb-10" size={40} strokeWidth={1} />
          <h2 className="text-4xl md:text-6xl font-display font-light mb-12 italic">Join the Collective.</h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gold hover:text-white transition-all duration-500"
          >
            Explore the Collection
          </motion.button>
        </div>
      </section>
    </div>
  );
}
