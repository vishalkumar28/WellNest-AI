import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // In a real implementation, you would send this data to your backend
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This is where you would normally send the email
      // For demonstration, we'll just log the data and show success
      console.log('Email would be sent to vishalkumar280404@gmail.com with:', formData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setFormStatus('success');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
      setErrorMessage('There was an error sending your message. Please try again later.');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20"
      >
        <h1 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-gray-200 space-y-6">
            <p>
              We'd love to hear from you! Whether you have a question about our services, need help with your account, or want to provide feedback, please don't hesitate to reach out.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Email</h3>
              <p>
                <a href="mailto:vishalkumar280404@gmail.com" className="text-purple-300 hover:text-purple-200 underline">
                  vishalkumar280404@gmail.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Response Time</h3>
              <p>
                We strive to respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Note</h3>
              <p>
                For urgent matters related to your account or privacy concerns, please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-purple-300 mb-1 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Name"
                  disabled={formStatus === 'submitting'}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-purple-300 mb-1 font-medium">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Email address"
                  disabled={formStatus === 'submitting'}
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-purple-300 mb-1 font-medium">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={formStatus === 'submitting'}
                >
                  <option value="" disabled className="bg-gray-800">Select a subject</option>
                  <option value="General Inquiry" className="bg-gray-800">General Inquiry</option>
                  <option value="Technical Support" className="bg-gray-800">Technical Support</option>
                  <option value="Account Issues" className="bg-gray-800">Account Issues</option>
                  <option value="Feedback" className="bg-gray-800">Feedback</option>
                  <option value="URGENT" className="bg-gray-800">URGENT</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-purple-300 mb-1 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="How can we help you?"
                  disabled={formStatus === 'submitting'}
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all ${formStatus === 'submitting' ? 'bg-purple-700/50 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/20'}`}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
              
              {/* Success Message */}
              {formStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 flex items-start"
                >
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Thank you for your message! We'll get back to you as soon as possible.</span>
                </motion.div>
              )}
              
              {/* Error Message */}
              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 flex items-start"
                >
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;