import React from "react";
import logo from "../../assets/aboutus.png"; // Keeping original asset
import { motion } from "framer-motion";
import { Star, Coffee, Leaf, Users, Award } from "lucide-react";

const About = () => {
  const beanFacts = [
    { name: "Arabica", caffeine: "80–140 mg", strength: "Mild & Aromatic", notes: "Fruit, Berries, Sugar" },
    { name: "Robusta", caffeine: "140–200 mg", strength: "Strong & Bold", notes: "Earth, Nuts, Chocolate" },
    { name: "Liberica", caffeine: "100–150 mg", strength: "Bold & Smoky", notes: "Woody, Spicy, Floral" },
    { name: "Excelsa", caffeine: "100–140 mg", strength: "Tart & Tangy", notes: "Fruit, Tart, Dark Roast" },
  ];

  return (
    <div className="bg-cream text-coffee-bean min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-coffee-bean">
          <img
            src={logo}
            alt="brewstore Origins"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold text-cream mb-6 tracking-tight"
          >
            Brew<span className="text-caramel italic">Store</span> Origins
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-latte/90 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Awakening senses with premium Himalayan beans. Rooted in tradition, roasted for the modern soul.
          </motion.p>
        </div>
      </div>

      {/* Pillars of Quality */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-muted-olive uppercase tracking-[0.2em] mb-3">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-coffee-bean">The brewstore Standard</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Award className="w-10 h-10 text-caramel" />,
                title: "Altitude Sourced",
                desc: "Hand-picked beans from high-altitude Himalayan terrain, ensuring dense beans with complex flavor profiles.",
              },
              {
                icon: <Coffee className="w-10 h-10 text-caramel" />,
                title: "Small-Batch Roast",
                desc: "Daily micro-roasting in Kathmandu ensures every bag arrives at peak freshness and aroma.",
              },
              {
                icon: <Users className="w-10 h-10 text-caramel" />,
                title: "Community Focused",
                desc: "Direct trade partnerships with local farmers guarantee fair wages and sustainable growth.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="bg-cream p-8 rounded-3xl border border-latte/30 hover:border-caramel/30 transition-all duration-300 hover:shadow-xl hover:shadow-coffee-bean/5 group text-center"
              >
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif font-bold mb-4 text-coffee-bean">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Split */}
      <section className="grid md:grid-cols-2 bg-coffee-bean text-cream">
        <div className="p-16 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
          <div className="max-w-md mx-auto">
            <span className="text-caramel font-bold text-xs uppercase tracking-widest mb-4 block">Our Purpose</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">The Mission</h2>
            <p className="text-latte/80 leading-relaxed text-lg font-light">
              To deliver world-class coffee that empowers local farmers, preserves Nepali coffee heritage, and offers you an unmatched sensory experience in every cup.
            </p>
          </div>
        </div>
        <div className="p-16 md:p-24 flex flex-col justify-center bg-rich-roast/30">
          <div className="max-w-md mx-auto">
            <span className="text-caramel font-bold text-xs uppercase tracking-widest mb-4 block">Our Future</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">The Vision</h2>
            <p className="text-latte/80 leading-relaxed text-lg font-light">
              To become Nepal’s most trusted specialty coffee exporter—synonymous with excellence, traceability, and relentless innovation in roasting.
            </p>
          </div>
        </div>
      </section>

      {/* Bean Knowledge Table */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-coffee-bean mb-4">Know Your Roast</h2>
          <p className="text-gray-500">A guide to the beans that fuel your day.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-latte/50 shadow-lg bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-bean text-cream text-sm uppercase tracking-wider">
                <th className="p-5 font-medium">Bean Variety</th>
                <th className="p-5 font-medium">Caffeine (8oz)</th>
                <th className="p-5 font-medium">Strength</th>
                <th className="p-5 font-medium hidden md:table-cell">Typical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {beanFacts.map((bean, i) => (
                <tr key={bean.name} className="hover:bg-latte/10 transition-colors">
                  <td className="p-5 font-serif font-bold text-base text-coffee-bean">{bean.name}</td>
                  <td className="p-5 font-mono text-gray-500">{bean.caffeine}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${bean.strength.includes("Mild") ? "bg-green-100 text-green-700" :
                      bean.strength.includes("Strong") ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                      {bean.strength}
                    </span>
                  </td>
                  <td className="p-5 hidden md:table-cell italic text-gray-500">{bean.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center py-16 px-6 bg-latte/20">
        <p className="text-coffee-bean font-serif text-xl italic max-w-2xl mx-auto">
          "Coffee is not just a drink; it’s a craft, a culture, and a connection."
        </p>
        <p className="text-gray-500 text-sm mt-4 uppercase tracking-widest font-bold">
          © 2025 brewstore Beans
        </p>
      </section>
    </div>
  );
};

export default About;
