import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20"
      >
        <h1 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-gray-200">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Introduction</h2>
            <p>
              Welcome to WellNest. By accessing or using our application, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Use of Service</h2>
            <p className="mb-3">
              WellNest provides a platform for tracking and analyzing personal wellness data. Our service is intended for personal use only. You agree to use the service only for lawful purposes and in accordance with these Terms.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">User Content</h2>
            <p className="mb-3">
              Our service allows you to input, store, and analyze personal wellness data. You retain all rights to your data, but grant us a license to use this data to provide and improve our services.
            </p>
            <p>
              You are solely responsible for the content you provide and its accuracy. We reserve the right to remove any content that violates these Terms or that we find objectionable for any reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Intellectual Property</h2>
            <p>
              The WellNest application, including its original content, features, and functionality, is owned by WellNest and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, create derivative works, publicly display, publicly perform, republish, or transmit any of the material without our express prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Disclaimer of Warranties</h2>
            <p>
              WellNest is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. WellNest is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Limitation of Liability</h2>
            <p>
              In no event shall WellNest be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Termination</h2>
            <p>
              We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which WellNest operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:vishalkumar280404@gmail.com" className="text-purple-300 hover:text-purple-200 underline">vishalkumar280404@gmail.com</a>.
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

export default TermsOfService;