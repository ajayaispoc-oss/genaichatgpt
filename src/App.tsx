/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2,
  Layers,
  Cpu,
  Globe,
  ArrowLeft,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  DollarSign,
  Rocket,
  BrainCircuit,
  Server,
  Mail,
  Phone,
  MapPin,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Chapter {
  id: number;
  title: string;
  description: string;
  topics: string[];
}

const salaryData = [
  { country: 'India (Entry)', amount: 800000, display: '₹8L' },
  { country: 'India (Mid)', amount: 1800000, display: '₹18L' },
  { country: 'India (Senior)', amount: 3500000, display: '₹35L+' },
  { country: 'USA (Entry)', amount: 95000, display: '$95K' },
  { country: 'USA (Mid)', amount: 145000, display: '$145K' },
  { country: 'USA (Senior)', amount: 210000, display: '$210K+' },
];

function DetailsPage({ onBack }: { onBack: () => void, key?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    status: 'fresher',
    role: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white text-[#1a1a1a] font-sans"
    >
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">GENAI CHATGPT</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Why Data Engineering is the <br />
              <span className="text-blue-600">Future of Technology.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              In the age of AI, data is the new oil. But raw oil is useless without a refinery. 
              Data Engineering is the refinery that powers the world's most intelligent systems.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30" />
        </div>
      </section>

      {/* Why Google Cloud Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 tracking-tight">Why Google Cloud Platform?</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Unmatched Speed & Scale</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Google's global network is the same infrastructure that powers Search and YouTube. 
                      BigQuery can scan petabytes of data in seconds, not hours.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Native AI Integration</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Vertex AI and Gemini are built directly into the data stack. 
                      Move from raw data to generative AI insights seamlessly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Cost-Effective Serverless</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Pay only for what you use. No servers to manage, no idle capacity. 
                      GCP's serverless model is the most mature in the industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gray-100 overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/gcp-data/800/800" 
                  alt="GCP Data Infrastructure" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="font-bold">Leader in Cloud AI</span>
                </div>
                <p className="text-sm text-gray-500">Gartner Magic Quadrant consistently ranks Google as a leader in Cloud AI and Data Services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Comparison Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">The AI Edge: Google Gemini vs. The Rest</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">How Google Cloud's AI implementation outpaces AWS and Azure in the Data Engineering space.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Google Cloud */}
            <div className="bg-white p-8 rounded-3xl border-2 border-blue-500 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Recommended
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Google Cloud (Gemini)</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Unified Vertex AI platform for all GenAI needs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Direct BigQuery integration (ML.GENERATE_TEXT).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Unmatched context window (up to 2M tokens).</span>
                </li>
              </ul>
              <p className="text-sm font-medium text-blue-600">Best for: End-to-end AI-driven data apps.</p>
            </div>

            {/* AWS */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">AWS (Bedrock)</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  <span className="text-sm text-gray-600">Multiple model providers (Anthropic, Meta, etc).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  <span className="text-sm text-gray-600">Strong enterprise integration but fragmented.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  <span className="text-sm text-gray-600">Steeper learning curve for data-AI workflows.</span>
                </li>
              </ul>
              <p className="text-sm font-medium text-gray-500">Best for: Multi-model flexibility.</p>
            </div>

            {/* Azure */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Azure (OpenAI)</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  <span className="text-sm text-gray-600">Exclusive access to GPT-4 models.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  <span className="text-sm text-gray-600">Strong Microsoft ecosystem integration.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  <span className="text-sm text-gray-600">Data residency and compliance focus.</span>
                </li>
              </ul>
              <p className="text-sm font-medium text-gray-500">Best for: Microsoft-heavy enterprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Career & Salaries Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Career Prospects & Salary Trends</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                The demand for GCP Data Engineers has grown by 45% year-over-year. 
                Companies are moving away from legacy systems to Google's modern data stack, 
                creating a massive talent gap.
              </p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">High Growth Industry</h4>
                    <p className="text-sm text-gray-500">Data Engineering is ranked as the #1 fastest-growing job in tech.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Top Tier Companies</h4>
                    <p className="text-sm text-gray-500">Google, Spotify, Twitter, and HSBC are all hiring GCP Data Engineers.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Global Opportunities</h4>
                    <p className="text-sm text-gray-500">Remote work opportunities in USA, Europe, and India are abundant.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" /> Annual Salary Packages
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="country" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0} 
                      height={80}
                      tick={{ fontSize: 12, fontWeight: 500 }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-xl">
                              <p className="font-bold text-gray-900">{payload[0].payload.country}</p>
                              <p className="text-blue-600 font-black text-xl">{payload[0].payload.display}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {salaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#3b82f6' : '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-center gap-8 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" /> India (INR)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" /> USA (USD)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gray-900 rounded-[3rem] p-16 md:p-24 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Rocket className="w-16 h-16 text-blue-500 mx-auto mb-8 animate-bounce" />
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Stop Waiting. Start Building.</h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                The next wave of technological innovation is being built on GCP. 
                Don't just watch it happen—be the one who builds it.
              </p>
              <button 
                onClick={() => document.getElementById('enroll-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
              >
                Enroll in the Training Program
              </button>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enroll-form" className="py-24 px-6 bg-blue-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 tracking-tight text-gray-900">Enrollment Request</h2>
              <p className="text-gray-600">Fill out the form below and our team will get in touch with you shortly.</p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
                <p className="text-gray-600">Thank you for your interest. We will contact you at {formData.email} soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-blue-600 font-bold hover:underline"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> City Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Professional Status */}
                <div className="space-y-4 pt-4">
                  <label className="text-sm font-bold text-gray-700">Are you a Fresher or Working Professional? <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-blue-50 transition-all flex-1 min-w-[200px]">
                      <input
                        type="radio"
                        name="status"
                        value="fresher"
                        checked={formData.status === 'fresher'}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium">Fresher</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-blue-50 transition-all flex-1 min-w-[200px]">
                      <input
                        type="radio"
                        name="status"
                        value="professional"
                        checked={formData.status === 'professional'}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium">Working Professional</span>
                    </label>
                  </div>
                </div>

                {/* Current Role */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Current Role / Designation</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer, Student, etc."
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-6 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-8"
                >
                  Submit Enrollment Request
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        © 2026 GCP - DATA ENGINEERING. All rights reserved.
      </footer>
    </motion.div>
  );
}

export default function App() {
  const [view, setView] = useState<'landing' | 'details'>('landing');
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'features' | 'curriculum'>('features');

  // This will be populated as the user provides content
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Generative AI on Google Cloud",
      description: "Harnessing the power of Foundation Models and Vertex AI for GenAI solutions.",
      topics: [
        "Introduction to Generative AI & Large Language Models (LLMs)",
        "Vertex AI Model Garden: Discovering Foundation Models (Gemini, PaLM 2)",
        "Generative AI Studio: Prototyping with Language, Vision, and Multimodal",
        "Prompt Engineering Techniques & Design Best Practices",
        "Tuning Foundation Models: Supervised Fine-Tuning (SFT) & RLHF",
        "Building GenAI Applications with Vertex AI SDK & LangChain",
        "Responsible AI: Implementing Safety Filters & Ethical AI Practices"
      ]
    },
    {
      id: 2,
      title: "Data Engineering Fundamentals & Python for Data",
      description: "Core concepts of data engineering, storage architectures, and data manipulation with Python.",
      topics: [
        "What is Data Engineering? Roles & Responsibilities",
        "Data Lakes vs. Data Warehouses: Architecture & Use Cases",
        "Designing Robust Data Pipelines: ETL vs. ELT",
        "Introduction to Python for Data Engineering",
        "Pandas DataFrames: Data Manipulation & Cleaning",
        "Dask & PySpark: Scaling DataFrames for Big Data",
        "Data Quality & Validation in Python Pipelines"
      ]
    },
    {
      id: 3,
      title: "Data Ingestion & API Integration",
      description: "Mastering data collection via REST APIs and cloud-native ingestion patterns.",
      topics: [
        "Introduction to REST API Architecture & HTTP Methods",
        "Authenticating with APIs: OAuth2, API Keys, & Bearer Tokens",
        "Working with JSON & XML Data Formats",
        "Python Requests Library: Fetching Data from External APIs",
        "Handling Pagination, Rate Limiting, & Retries",
        "Building Custom Data Ingestors for Cloud Storage",
        "Serverless Ingestion with Cloud Functions & Cloud Run"
      ]
    },
    {
      id: 4,
      title: "Introduction to Google Cloud Platform (GCP)",
      description: "Getting started with cloud computing and the GCP ecosystem.",
      topics: [
        "Cloud Computing Overview: Public, Private, & Hybrid Cloud",
        "Cloud Service Models: IaaS vs. PaaS vs. SaaS",
        "GCP Global Infrastructure: Regions & Zones",
        "GCP Resource Hierarchy: Projects, Folders, & Organizations",
        "GCP Tools & Components: Compute, Storage, & Networking",
        "Interacting with GCP: Console, gcloud CLI, & SDKs",
        "Essential gcloud CLI Commands for Data Engineers"
      ]
    },
    {
      id: 5,
      title: "Google Cloud Storage (GCS)",
      description: "Mastering object storage for data lakes and large-scale data management.",
      topics: [
        "Introduction to Object Storage & GCS Buckets",
        "Accessing GCS through the Google Cloud Console",
        "Managing Data: Uploading, Downloading, & Organizing Files via UI",
        "Interacting with GCS using Python: Reading & Writing Data Files",
        "Programmatic File Deletion & Lifecycle Management",
        "Data Protection: Retention Policies & Object Versioning",
        "Security & Access Control: IAM vs. ACLs vs. Signed URLs"
      ]
    },
    {
      id: 6,
      title: "Google BigQuery: Enterprise Data Warehousing",
      description: "Mastering petabyte-scale analytics, serverless warehousing, and advanced SQL.",
      topics: [
        "BigQuery Architecture: Dremel, Colossus, Jupiter, & Borg",
        "Resource Hierarchy: Datasets, Tables, Views, & Materialized Views",
        "Data Ingestion: Batch Loading, Streaming Inserts, & Data Transfer Service",
        "Querying Data: Standard SQL, Window Functions, & Analytical Patterns",
        "Performance Optimization: Partitioning & Clustering Strategies",
        "BigQuery ML: Building Machine Learning Models using SQL",
        "BigQuery Omni: Multi-cloud Analytics (AWS S3 & Azure Blob)",
        "BI Engine: Accelerating Dashboards with In-memory Analysis",
        "Security & Governance: IAM, Authorized Views, & Column-level Security",
        "Cost Management: On-demand vs. Capacity-based Pricing & Slot Management",
        "BigQuery Studio: Unified Workspace for Data Engineering & Analytics"
      ]
    },
    {
      id: 7,
      title: "Cloud SQL & Cloud Bigtable: Relational & NoSQL Databases",
      description: "Mastering managed relational databases and high-performance NoSQL storage on GCP.",
      topics: [
        "Introduction to Cloud SQL: Managed MySQL, PostgreSQL, & SQL Server",
        "Cloud SQL Architecture: High Availability, Read Replicas, & Backups",
        "Connecting to Cloud SQL: Cloud SQL Proxy & Private IP",
        "Cloud Bigtable: High-Performance, Fully Managed NoSQL Database",
        "Bigtable Architecture: Nodes, Clusters, & Instances",
        "Designing Bigtable Schema: Row Keys & Column Families",
        "Bigtable Performance Tuning & Monitoring",
        "Choosing the Right Database: Cloud SQL vs. Bigtable vs. Spanner"
      ]
    },
    {
      id: 8,
      title: "Cloud Data Fusion: Visual Data Integration",
      description: "Building and managing code-free data pipelines with a fully managed, cloud-native integration service.",
      topics: [
        "Introduction to Cloud Data Fusion: Fully Managed, Cloud-Native Data Integration",
        "Data Fusion Architecture: CDAP, Hub, and Execution Environments",
        "Visual Pipeline Design: Sources, Transforms, and Sinks",
        "Data Wrangling: Interactive Data Preparation and Cleaning",
        "Integrating with GCS, BigQuery, and Cloud SQL",
        "Pipeline Scheduling, Monitoring, and Error Handling",
        "Reusable Pipeline Templates, Macros, and Plugins",
        "Security: IAM, VPC Service Controls, and Data Encryption"
      ]
    },
    {
      id: 9,
      title: "Machine Learning on GCP: Vertex AI & MLOps",
      description: "Building, deploying, and scaling machine learning models using Google Cloud's unified AI platform.",
      topics: [
        "Introduction to AI & Machine Learning on Google Cloud",
        "Vertex AI: The Unified Platform for the ML Lifecycle",
        "AutoML: Training High-Quality Models with Minimal Effort",
        "Custom Training: Using TensorFlow, PyTorch, & Scikit-learn on Vertex AI",
        "Model Deployment: Serving Predictions with Vertex AI Endpoints",
        "Vertex AI Feature Store: Managing & Serving ML Features",
        "MLOps with Vertex AI Pipelines: Orchestrating Workflows",
        "Pre-trained AI APIs: Vision, Natural Language, & Translation",
        "Model Monitoring: Detecting Skew & Drift in Production"
      ]
    },
    {
      id: 10,
      title: "Job Scheduling, Monitoring, & Troubleshooting",
      description: "Mastering the orchestration, observability, and maintenance of data pipelines on GCP.",
      topics: [
        "Introduction to Cloud Scheduler: Fully Managed Cron Job Service",
        "Cloud Composer: Orchestrating Workflows with Apache Airflow",
        "Designing Directed Acyclic Graphs (DAGs) for Data Pipelines",
        "Monitoring with Cloud Monitoring: Dashboards, Metrics, & Alerts",
        "Logging with Cloud Logging: Centralized Log Management & Analysis",
        "Troubleshooting Data Pipelines: Debugging Common Failures",
        "Error Handling & Retries in Cloud Workflows",
        "Cost Monitoring & Resource Optimization for Jobs",
        "Setting up Uptime Checks & Incident Response"
      ]
    }
  ];

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div 
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans selection:bg-blue-100"
        >
          {/* Navigation */}
          <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <BrainCircuit className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight">GENAI CHATGPT</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <a href="#curriculum" className="hover:text-blue-600 transition-colors">TRAINING CONTENT</a>
                <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                <button 
                  onClick={() => setView('details')}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <header className="relative pt-20 pb-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <Zap className="w-3 h-3" />
                  Professional Certification Path
                </div>
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
                  Master <span className="text-blue-600">Data Engineering</span> & AI Training.
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
                  The ultimate Generative AI learning path. Master AI tools like ChatGPT, Claude, and Google Cloud Platform with our industry-aligned TRAINING CONTENT.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setView('details')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    Get Started <ChevronRight className="w-5 h-5" />
                  </button>
                  <a 
                    href="#curriculum"
                    className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    View TRAINING CONTENT
                  </a>
                </div>
              </motion.div>
            </div>
            
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10">
              <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-40 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
            </div>
          </header>

          {/* Tab Navigation */}
          <section className="max-w-7xl mx-auto px-6 mb-12">
            <div className="flex justify-center">
              <div className="inline-flex p-1 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'features' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  GCP Features
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'curriculum' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  TRAINING CONTENT
                </button>
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {activeTab === 'features' ? (
              <motion.section
                key="features-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-12 px-6"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">GCP Ecosystem Components</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Explore the core building blocks of Google Cloud Platform, including legacy services and their modern successors.
                    </p>
                  </div>

                  <div className="space-y-24">
                    {/* Component Group: Compute */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <Cpu className="w-3 h-3" /> Compute & Serverless
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Scalable Compute Infrastructure</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">CR</div>
                              <div>
                                <h4 className="font-bold text-lg">Cloud Run (v2)</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">Modern Standard</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              Fully managed environment for running containerized applications. Successor to App Engine for many use cases.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Real-time Usage</span>
                              <p className="text-sm text-gray-700 italic">"Deploying a microservices-based e-commerce backend that scales to zero when no traffic is present, saving 70% in costs."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">CF</div>
                              <div>
                                <h4 className="font-bold text-lg">Cloud Functions (v1)</h4>
                                <span className="text-xs text-orange-600 font-bold uppercase">Retired/Legacy</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              The original serverless execution environment. Now superseded by Cloud Functions (2nd gen) built on Cloud Run.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="https://picsum.photos/seed/compute/800/600" 
                          alt="Compute Architecture" 
                          className="rounded-[2rem] shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        {/* Mock Architecture Diagram Overlay */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                          <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" /> Serverless Flow
                          </h5>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                              <div className="h-full w-3/4 bg-blue-600" />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-400">
                              <span>REQUEST</span>
                              <span>AUTO-SCALE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Component Group: Data & Storage */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div className="order-2 lg:order-1 relative">
                        <img 
                          src="https://picsum.photos/seed/data/800/600" 
                          alt="Data Warehousing" 
                          className="rounded-[2rem] shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -top-6 -right-6 bg-blue-600 p-6 rounded-3xl shadow-xl text-white max-w-xs hidden md:block">
                          <Database className="w-8 h-8 mb-4" />
                          <p className="font-bold text-lg">BigQuery ML</p>
                          <p className="text-sm text-blue-100">Train models directly in your warehouse using SQL.</p>
                        </div>
                      </div>
                      <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <Database className="w-3 h-3" /> Storage & Analytics
                        </div>
                        <h3 className="text-3xl font-bold mb-6">The Modern Data Stack</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">BQ</div>
                              <div>
                                <h4 className="font-bold text-lg">BigQuery (Omni)</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">New Generation</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              Multi-cloud data warehouse that allows you to analyze data across GCP, AWS, and Azure without moving it.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Real-time Usage</span>
                              <p className="text-sm text-gray-700 italic">"Running federated queries on S3 data from a GCP console to generate a unified global sales report."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">SQL</div>
                              <div>
                                <h4 className="font-bold text-lg">Cloud SQL (First Gen)</h4>
                                <span className="text-xs text-orange-600 font-bold uppercase">Retired</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              The original managed MySQL service. Now replaced by Second Gen instances with significantly better performance and availability.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Component Group: AI & Operations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <BrainCircuit className="w-3 h-3" /> AI & Operations
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Intelligent Monitoring</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">MO</div>
                              <div>
                                <h4 className="font-bold text-lg">Cloud Monitoring</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">Current Version</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              Full-stack observability for your infrastructure and applications. Integrated with Vertex AI for anomaly detection.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Real-time Usage</span>
                              <p className="text-sm text-gray-700 italic">"Setting up automated alerts for high latency in a GKE cluster and using AI-driven insights to find the root cause."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">SD</div>
                              <div>
                                <h4 className="font-bold text-lg">Stackdriver</h4>
                                <span className="text-xs text-orange-600 font-bold uppercase">Retired Branding</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              The original monitoring tool acquired by Google. Now fully rebranded and integrated as Google Cloud Operations Suite.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="https://picsum.photos/seed/ai/800/600" 
                          alt="AI Operations" 
                          className="rounded-[2rem] shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-[2rem]" />
                      </div>
                    </div>

                    {/* Component Group: Networking & Security */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div className="order-2 lg:order-1 relative">
                        <img 
                          src="https://picsum.photos/seed/network/800/600" 
                          alt="Global Networking" 
                          className="rounded-[2rem] shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                          <Globe className="w-8 h-8 text-blue-600 mb-4" />
                          <p className="font-bold text-lg">Global VPC</p>
                          <p className="text-sm text-gray-500">Connect resources across regions on Google's private fiber network.</p>
                        </div>
                      </div>
                      <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <ShieldCheck className="w-3 h-3" /> Networking & Security
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Global Connectivity</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">LB</div>
                              <div>
                                <h4 className="font-bold text-lg">Cloud Load Balancing</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">Next Gen (Envoy-based)</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              High-performance, scalable load balancing with global reach. Supports advanced traffic management.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Real-time Usage</span>
                              <p className="text-sm text-gray-700 italic">"Directing traffic to the nearest healthy instance across 20+ global regions with sub-second failover."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">CLB</div>
                              <div>
                                <h4 className="font-bold text-lg">Classic Load Balancer</h4>
                                <span className="text-xs text-orange-600 font-bold uppercase">Legacy</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              The original GCLB implementation. Still supported but lacks the advanced features of the newer Envoy-based proxies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="curriculum-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                id="curriculum"
                className="py-12 px-6 bg-[#f8fafc]"
              >
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">TRAINING CONTENT</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                      Our TRAINING CONTENT is updated weekly to reflect the latest GCP features and industry best practices.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {chapters.map((chapter) => (
                      <motion.div 
                        key={chapter.id}
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                        initial={false}
                      >
                        <button 
                          onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
                          className="w-full text-left px-8 py-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-6">
                            <span className="text-4xl font-black text-blue-100">0{chapter.id}</span>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{chapter.title}</h3>
                              <p className="text-gray-500 mt-1">{chapter.description}</p>
                            </div>
                          </div>
                          <div className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-300 ${activeChapter === chapter.id ? 'rotate-180 bg-blue-600 border-blue-600 text-white' : 'text-gray-400'}`}>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </button>
                        
                        {activeChapter === chapter.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="px-8 pb-8"
                          >
                            <div className="pt-4 border-t border-gray-50">
                              <h4 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Learning Objectives
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {chapter.topics.map((topic, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 group hover:bg-blue-50 transition-colors">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium group-hover:text-blue-900">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Placeholder for future chapters */}
                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-400">More Chapters Coming Soon</h3>
                      <p className="text-gray-400 mt-2">We are currently designing the next modules of the TRAINING CONTENT.</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Ready to become a GCP Data Engineer?</h2>
              <p className="text-xl text-blue-100 mb-12">Join 5,000+ students who have transformed their careers with our specialized training.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setView('details')}
                  className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all"
                >
                  Enroll in the Course
                </button>
                <button className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all border border-blue-500">
                  Download Syllabus
                </button>
              </div>
            </div>
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <BrainCircuit className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight">GENAI CHATGPT</span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                Empowering the next generation of AI and Data professionals with high-quality training on Google Cloud, ChatGPT, and Generative AI.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Course</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#curriculum" className="hover:text-blue-600 transition-colors">TRAINING CONTENT</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-50 text-center text-gray-400 text-sm">
            © 2026 GENAI CHATGPT. All rights reserved.
          </div>
        </div>
      </footer>
    </motion.div>
      ) : (
        <DetailsPage key="details" onBack={() => setView('landing')} />
      )}
    </AnimatePresence>
  );
}
