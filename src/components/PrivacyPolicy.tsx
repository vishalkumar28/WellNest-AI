import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20"
      >
        <h1 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-200">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Introduction</h2>
            <p>
              At WellNest, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our wellness tracking application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Information We Collect</h2>
            <p className="mb-3">
              We collect information that you voluntarily provide to us when you register for the application, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information such as your name and email address</li>
              <li>Wellness data including mood, energy levels, sleep quality, and stress levels</li>
              <li>Any additional information you choose to share through our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">How We Use Your Information</h2>
            <p className="mb-3">
              The information we collect is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized wellness insights and recommendations</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you updates about our services (you can opt out at any time)</li>
              <li>Monitor and analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Data Retention</h2>
            <p>
              We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Your Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to certain processing of your data</li>
              <li>Data portability (receiving your data in a structured, commonly used format)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:vishalkumar280404@gmail.com" className="text-purple-300 hover:text-purple-200 underline">vishalkumar280404@gmail.com</a>.
            </p>
          </section>

          <div className="text-sm text-gray-400 mt-8">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;