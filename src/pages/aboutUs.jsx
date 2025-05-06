import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 

const AboutUs = () => {
  const navigate = useNavigate();
  const teamMembers = [
    { name: 'Abenezer Teshome', img: '/team/abenezer-teshome.jpg' },
    { name: 'Abrahm Kinde', img: '/team/abrahm-kinde.jpg' },
    { name: 'Eyob Teshager', img: '/team/eyob-teshager.jpg' },
    { name: 'Abenezer Berhanu', img: '/team/abenezer-berhanu.jpg' },
    { name: 'Abrahm Abebe', img: '/team/abrahm-abebe.jpg' },
  ];

  const features = [
    {
      title: 'Personalized Recommendations',
      description: 'Our hybrid-based filtering algorithm tailors book suggestions to your unique preferences.',
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
    <div className="bg-gray-100  text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-blue-800 text-white py-12 text-center shadow">
        <div className="container mx-auto px-4">
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 flex items-center text-white hover:text-blue-200">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-lg">Discover the team behind the Book Recommendation System</p>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-10">
        {/* Our Story */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">Our Story</h2>
          <p className="mb-4">
            Welcome to the Book Recommendation System, a platform designed to revolutionize the way readers discover books, with a special focus on Ethiopian literature. Our mission is to bridge the gap between readers and books by providing personalized recommendations, fostering community engagement, and promoting local authors.
          </p>
          <p>
            This project was developed by a dedicated team of Computer Science students from the University of Gondar, Ethiopia, as part of our final year project. Recognizing the challenges readers face in discovering books—especially native Ethiopian titles—we set out to create a solution that combines advanced technology with community-driven features.
          </p>
        </section>

       
        {/* Our Vision */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">Our Vision</h2>
          <p>
            We envision a world where every reader can effortlessly find books that resonate with their interests, where local authors gain the visibility they deserve, and where literary communities thrive. By leveraging cutting-edge technology and user-centric design, we aim to make this vision a reality.
          </p>
        </section>

        {/* What We Offer */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded border-l-4 border-blue-300">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">Join Us</h2>
          <p>
            Whether you're a casual reader, a book enthusiast, or an author looking to reach a wider audience, our platform is designed for you. Together, let's build a vibrant literary community and make book discovery a delightful experience.
          </p>
        </section>
        {/* Our Team */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 pb-4 text-center">Our Team</h2>
          <p className="text-center mb-6">We are a group of passionate individuals committed to enhancing the reading experience.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border border-blue-300 shadow"
                />
                <p className="mt-2 font-medium">{member.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-2">Thank you for being part of our journey!</p>
          <p className="font-semibold">The Book Recommendation System Team</p>
          <p>University of Gondar, Ethiopia</p>
          <p className="mt-2">May 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
