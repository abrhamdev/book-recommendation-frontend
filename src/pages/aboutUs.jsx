import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import  AbeniB from '../../public/images/Abeni-B.jpg'

const AboutUs = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { name: 'Abenezer Teshome', img: '../../public/images/Abeni-Tes.jpg' },
    { name: 'Abrahm Kinde', img: '../../public/images/AbrhamK.jpg' },
    { name: 'Eyob Teshager', img: '../../public/images/Eyob.jpg' },
    { name: 'Abenezer Berhanu', img: '../../public/images/Abeni-B.jpg' },
    { name: 'Abrahm Abebe', img: '../../public/images/AbrhamA.jpg' },
  ];

  const features = [
    {
      title: 'Personalized Recommendations',
      description: 'Our filtering algorithm tailors book suggestions to your unique preferences.',
    },
    {
      title: 'Community Features',
      description: 'Join book clubs, participate in discussions, and connect with fellow readers.',
    },
    {
      title: 'Local Focus',
      description: 'Discover and celebrate Ethiopian literature alongside global titles.',
    },
    {
      title: 'User-Friendly Interface',
      description: 'A clean, intuitive design ensures a smooth experience across devices.',
    },
  ];

  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="relative bg-blue-700 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 flex items-center text-white cusror-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold mb-2"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg"
          >
            Discover the team behind the Book Recommendation System
          </motion.p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12 space-y-12">
        {[{
          title: 'Our Story',
          content: [
            'Welcome to the Book Recommendation System! We’re here to help readers uncover amazing books they may not have found otherwise — especially local Ethiopian gems. Our mission is to make book discovery both easy and personal, powered by community and technology.',
            'Born out of a final year project at the University of Gondar, our team of passionate Computer Science students saw a need: readers, especially in Ethiopia, were missing out on great books. That’s why we built this platform — to connect people with literature that speaks to them.'
          ]
        },
        {
          title: 'Our Vision',
          content: [
            'We believe every reader deserves a meaningful connection with the books they read. Our vision is to build a world where discovering a perfect book — be it an Ethiopian novel or a global bestseller — is intuitive, fun, and rewarding. Think of us as your literary companion, always learning and recommending what you love most.'
          ]
        },
        {
          title: 'Join Us',
          content: [
            "If you're someone who loves books or wants to support Ethiopian literature, we welcome you! Whether you're a reader, an author, or a curious explorer — there's a place here for you. Dive into discussions, start a book club, or just sit back and discover your next great read."
          ]
        }].map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 md:p-8 rounded-md shadow"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 border-l-4 border-blue-400 pl-4 mb-4">
              {section.title}
            </h2>
            {section.content.map((paragraph, j) => (
              <p key={j} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
            ))}
          </motion.section>
        ))}

        {/* What We Offer */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 md:p-8 rounded-md shadow"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 border-l-4 border-blue-400 pl-4 mb-6">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="bg-blue-50 hover:bg-blue-100 transition-colors duration-300 p-5 rounded-md border-l-4 border-blue-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-1">{feature.title}</h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Team */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 md:p-8 rounded-md shadow"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-2">Our Team</h2>
          <p className="text-center text-gray-700 mb-8">We are a group of passionate individuals committed to enhancing the reading experience.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  src={member.img}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-700 shadow-sm hover:shadow-lg transition-shadow duration-300"
                />
                <p className="mt-3 text-sm font-medium text-gray-800">{member.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-4 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-1">Thank you for being part of our journey!</p>
          <p className="font-semibold">NovaReads Team</p>
          <p className="text-sm">June 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
