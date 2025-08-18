import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Services from '../components/Services';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="mb-4">
            <Navbar />
        </div>
        <Banner />
        <Services />
      </div>
      <Footer />
    </div>
  );
};

export default Home;