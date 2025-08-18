import React from 'react';

const services = [
  { title: 'Plumbing', description: 'Fix leaks, install pipes and more.' },
  { title: 'Cleaning', description: 'Home and office cleaning services.' },
  { title: 'Electrician', description: 'Wiring, repairs, and installations.' },
  { title: 'Pest Control', description: 'Safe and effective pest management.' },
];

const Services = () => {
  return (
    <div className="py-10 px-4 md:px-20">
      <h3 className="text-2xl font-semibold text-center mb-8">Our Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-emerald-500 shadow-md rounded-lg p-6 hover:shadow-lg">
            <h4 className="text-xl font-bold mb-2">{service.title}</h4>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;