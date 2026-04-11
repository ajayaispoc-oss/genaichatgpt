/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
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
  User,
  AlertCircle,
  Menu,
  X
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
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, getDocFromServer, doc } from 'firebase/firestore';

// --- Firebase Connection Test ---
async function testConnection() {
  try {
    // Attempt to fetch a non-existent document to test connectivity
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('unavailable')) {
        console.error("Firestore connectivity issue: The backend is unreachable. This may be due to network restrictions or an incorrect database ID.");
      } else {
        console.error("Firestore connection test error:", error.message);
      }
    }
  }
}
testConnection();

// --- Firebase Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) errorMessage = `Error: ${parsed.error}`;
        }
      } catch {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

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

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry');
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Failed to send your inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
        <p className="text-gray-600">Thank you for reaching out. Ajay will get back to you shortly.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 text-blue-600 font-bold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
        <input
          required
          type="text"
          className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
        <input
          required
          type="tel"
          className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Your Requirement</label>
        <textarea
          required
          rows={4}
          className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none resize-none"
          placeholder="Describe your training requirements..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          'Send Inquiry'
        )}
      </button>
    </form>
  );
}

function DetailsPage({ onBack }: { onBack: () => void, key?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    status: 'fresher',
    role: '',
    experience: '',
    jobRole: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'leads';
      // 1. Save to Firestore (Primary)
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // 2. Send Email Alert (Secondary)
      try {
        await fetch('/api/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
        // We don't block the user if the email fails, as long as data is in Firestore
      }

      setSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
      setError("Failed to submit enrollment request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <img src="/mylogo.png" alt="GenAI ChatGPT Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
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
              Mastering Agentic AI & <br />
              <span className="text-blue-600">The Rise of the AI Architect.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              In 2026, Data Engineering has evolved. It's no longer just about pipelines; it's about building autonomous agentic systems that power the enterprise.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30" />
        </div>
      </section>

      {/* Enrollment Form Section (Moved to top for better accessibility) */}
      <section id="enroll-form" className="py-12 px-6 bg-blue-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 tracking-tight text-gray-900">Enrollment Request</h2>
              <p className="text-gray-600">Fill out the form below to start your journey.</p>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> City Name
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Professional Status */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-gray-700">Are you a Fresher or Working Professional? <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-blue-50 transition-all flex-1 min-w-[150px]">
                      <input
                        type="radio"
                        name="status"
                        value="fresher"
                        checked={formData.status === 'fresher'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium text-sm">Fresher</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-blue-50 transition-all flex-1 min-w-[150px]">
                      <input
                        type="radio"
                        name="status"
                        value="professional"
                        checked={formData.status === 'professional'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium text-sm">Professional</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Fields for Professionals */}
                {formData.status === 'professional' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 overflow-hidden"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        required={formData.status === 'professional'}
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                        <User className="w-3 h-3" /> Existing Job Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        required={formData.status === 'professional'}
                        type="text"
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleChange}
                        placeholder="e.g. Senior Developer"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                      />
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-xl mt-4 flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Enrollment Request'}
                  {!isSubmitting && <ChevronRight className="w-5 h-5" />}
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

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        © 2026 GENAI CHATGPT. All rights reserved.
      </footer>
    </motion.div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const [view, setView] = useState<'landing' | 'details'>('landing');
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'features' | 'curriculum'>('features');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTab = (tab: 'features' | 'curriculum') => {
    setActiveTab(tab);
    setTimeout(() => scrollToSection('tab-section'), 100);
  };

  // This will be populated as the user provides content
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Agentic AI & Multi-Agent Systems (2026)",
      description: "Mastering the shift from chatbots to autonomous agentic workflows.",
      topics: [
        "Introduction to Agentic Frameworks: CrewAI, LangGraph, & AutoGen",
        "Designing Multi-Agent Systems for Enterprise Automation",
        "Model Context Protocol (MCP): Connecting AI to Real-time Data",
        "Building Agentic CLIs with Claude Code & Gemini AI Studio Pro",
        "Vector Databases for Long-term Memory: Pinecone & Weaviate",
        "Agentic Tool Use: Function Calling & API Orchestration",
        "Responsible Agentic AI: Guardrails & Human-in-the-loop Patterns"
      ]
    },
    {
      id: 2,
      title: "Anthropic Academy: Claude 4.6 for Enterprise",
      description: "Deep dive into the world's most powerful enterprise LLM.",
      topics: [
        "Claude 4.5/4.6 Architecture & Performance Benchmarks",
        "Claude Code Masterclass: Agentic Coding at Scale",
        "Anthropic Academy Prep: Partner Training Certification",
        "Prompt Engineering for Claude: XML Tags & Thinking Blocks",
        "Context Window Optimization: Handling 1M+ Tokens",
        "Claude for Data Analysis: Integrating with BigQuery ML",
        "Deploying Claude on Vertex AI & AWS Bedrock"
      ]
    },
    {
      id: 3,
      title: "Google Cloud: Generative AI Leader & Vertex AI",
      description: "Strategic leadership and technical mastery of GCP's AI stack.",
      topics: [
        "GCP Generative AI Leader Certification Prep (2026 Update)",
        "Vertex AI Specialist: Model Garden & Custom Training",
        "BigQuery ML: Running LLMs directly on Petabyte-scale Data",
        "Gemini 1.5 Pro & Flash: Multimodal Data Pipelines",
        "Grounding AI with Enterprise Data: Vertex AI Search & Conversation",
        "Fine-tuning Foundation Models on GCP Infrastructure",
        "MLOps for GenAI: Versioning, Monitoring, & Scaling"
      ]
    },
    {
      id: 4,
      title: "Data Engineering Jobs 2026: The AI Architect",
      description: "Evolving from a Data Engineer to an AI Architect.",
      topics: [
        "The Rise of the AI Architect: Roles & Responsibilities 2026",
        "Designing Multi-cloud AI Architectures: GCP, Azure, & AWS",
        "Azure AI Engineer Associate (AI-102) Integration with GCP",
        "Building Real-time AI Pipelines with Dataflow & Pub/Sub",
        "Data Governance in the Age of Agentic AI",
        "Cost Optimization for Large-scale AI Deployments",
        "Career Roadmap: Landing High-paying AI Architect Roles"
      ]
    },
    {
      id: 5,
      title: "Modern Data Stack: BigQuery & Cloud Storage",
      description: "The foundation of every AI-driven enterprise.",
      topics: [
        "BigQuery Architecture: Dremel & Serverless Analytics",
        "Designing Scalable Data Lakes with Google Cloud Storage",
        "Advanced SQL for AI: Window Functions & JSON Processing",
        "Data Ingestion Patterns: Batch, Streaming, & CDC",
        "Performance Optimization: Partitioning & Clustering",
        "BigQuery Omni: Multi-cloud Analytics without Data Movement",
        "Security & IAM: Protecting the Enterprise Data Asset"
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
                <img src="/mylogo.png" alt="GenAI ChatGPT Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
                <span className="font-bold text-xl tracking-tight">GENAI CHATGPT</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <button 
                  onClick={() => scrollToTab('curriculum')}
                  className="hover:text-blue-600 transition-colors cursor-pointer py-2 relative z-10"
                >
                  TRAINING CONTENT
                </button>
                <button 
                  onClick={() => scrollToTab('features')}
                  className="hover:text-blue-600 transition-colors cursor-pointer py-2 relative z-10"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('about-us')}
                  className="hover:text-blue-600 transition-colors cursor-pointer py-2 relative z-10"
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-blue-600 transition-colors cursor-pointer py-2 relative z-10"
                >
                  Contact
                </button>
                <button 
                  onClick={() => setView('details')}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 relative z-10"
                >
                  Enroll Now
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
                >
                  <div className="flex flex-col p-6 gap-4">
                    <button 
                      onClick={() => { scrollToTab('curriculum'); setIsMenuOpen(false); }}
                      className="text-left text-gray-600 font-medium hover:text-blue-600 transition-colors py-2 cursor-pointer"
                    >
                      TRAINING CONTENT
                    </button>
                    <button 
                      onClick={() => { scrollToTab('features'); setIsMenuOpen(false); }}
                      className="text-left text-gray-600 font-medium hover:text-blue-600 transition-colors py-2 cursor-pointer"
                    >
                      Features
                    </button>
                    <button 
                      onClick={() => { scrollToSection('about-us'); setIsMenuOpen(false); }}
                      className="text-left text-gray-600 font-medium hover:text-blue-600 transition-colors py-2 cursor-pointer"
                    >
                      About Us
                    </button>
                    <button 
                      onClick={() => { scrollToSection('contact'); setIsMenuOpen(false); }}
                      className="text-left text-gray-600 font-medium hover:text-blue-600 transition-colors py-2 cursor-pointer"
                    >
                      Contact
                    </button>
                    <button 
                      onClick={() => { setView('details'); setIsMenuOpen(false); }}
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all text-center cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  2026 AI Architect Certification Path
                </div>
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
                  Master <span className="text-blue-600">Agentic AI</span> & Data Engineering.
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
                  The #1 training for Data Engineering and Agentic AI in Hyderabad. Master Claude 4.6, Vertex AI, and Multi-Agent Systems with 15 years of industry expertise.
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
          <section id="tab-section" className="max-w-7xl mx-auto px-6 mb-12 scroll-mt-32">
            <div className="flex justify-center">
              <div className="inline-flex p-1 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'features' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  GCP Features
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'curriculum' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
                id="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-12 px-6"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Mastering Agentic AI Workflows for Data Engineers</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      The Best GenAI and GCP Training in Hyderabad, Telangana. Evolve from traditional ETL to autonomous multi-agent systems.
                    </p>
                  </div>

                  <div className="space-y-24">
                    {/* Component Group: Agentic Frameworks */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <Cpu className="w-3 h-3" /> Agentic Frameworks
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Cloud Architect Training: Designing Multi-Agent Systems</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">LG</div>
                              <div>
                                <h4 className="font-bold text-lg">LangGraph & CrewAI</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">2026 Industry Standard</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              Build stateful, multi-actor applications with cycles. The primary framework for complex agentic reasoning in production.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Enterprise Use Case</span>
                              <p className="text-sm text-gray-700 italic">"Orchestrating a fleet of agents to automate end-to-end data quality auditing and self-healing pipelines."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">AG</div>
                              <div>
                                <h4 className="font-bold text-lg">Microsoft AutoGen</h4>
                                <span className="text-xs text-blue-600 font-bold uppercase">Multi-Cloud Ready</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Enabling multi-agent conversations to solve complex tasks. Seamlessly integrates with Azure AI and GCP Vertex AI.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="https://picsum.photos/seed/agents/800/600" 
                          alt="Multi-Agent System Architecture" 
                          className="rounded-[2rem] shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                          <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" /> Agentic Flow
                          </h5>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                              <div className="h-full w-full bg-blue-600" />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-400">
                              <span>REASONING</span>
                              <span>ACTION</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Component Group: Connectivity & Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div className="order-2 lg:order-1 relative">
                        <img 
                          src="https://picsum.photos/seed/mcp/800/600" 
                          alt="Model Context Protocol" 
                          className="rounded-[2rem] shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -top-6 -right-6 bg-blue-600 p-6 rounded-3xl shadow-xl text-white max-w-xs hidden md:block">
                          <Database className="w-8 h-8 mb-4" />
                          <p className="font-bold text-lg">MCP Servers</p>
                          <p className="text-sm text-blue-100">The new standard for connecting AI to your enterprise data sources.</p>
                        </div>
                      </div>
                      <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <Database className="w-3 h-3" /> Connectivity & Vector Data
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Anthropic Academy Prep: Claude 4.6 for Enterprise</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">VC</div>
                              <div>
                                <h4 className="font-bold text-lg">Pinecone & Weaviate</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">Long-term Memory</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              High-performance vector databases for RAG and agentic memory. Essential for building context-aware AI systems.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Technical Edge</span>
                              <p className="text-sm text-gray-700 italic">"Implementing sub-second semantic search across billions of document embeddings for real-time AI grounding."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">BQ</div>
                              <div>
                                <h4 className="font-bold text-lg">BigQuery ML (2026)</h4>
                                <span className="text-xs text-orange-600 font-bold uppercase">Serverless AI</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Directly invoke Claude 4.6 and Gemini 1.5 Pro within BigQuery using SQL. No data movement required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Component Group: Coding & Tools */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
                          <BrainCircuit className="w-3 h-3" /> Agentic Coding Tools
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Data Engineering Jobs 2026: The Rise of the AI Architect</h3>
                        <div className="space-y-8">
                          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">CC</div>
                              <div>
                                <h4 className="font-bold text-lg">Claude Code (Agentic CLI)</h4>
                                <span className="text-xs text-green-600 font-bold uppercase">Next-Gen DevEx</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              The first agentic CLI that can write, test, and deploy code autonomously. A must-have for modern Data Engineers.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Productivity Boost</span>
                              <p className="text-sm text-gray-700 italic">"Automating the migration of legacy SQL scripts to optimized BigQuery ML models using Claude Code."</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 opacity-75">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">GS</div>
                              <div>
                                <h4 className="font-bold text-lg">Gemini AI Studio Pro</h4>
                                <span className="text-xs text-blue-600 font-bold uppercase">GCP Native</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Rapidly prototype and deploy multimodal AI applications with Google's most capable models.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="https://picsum.photos/seed/coding/800/600" 
                          alt="Agentic Coding" 
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

          {/* Glossary Section */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Glossary of AI Terms 2026</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Stay ahead of the curve with the essential terminology for the AI Architect era.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { term: "Agentic Workflow", definition: "A design pattern where AI models are given tools and autonomy to complete complex, multi-step tasks without constant human prompting." },
                  { term: "MCP (Model Context Protocol)", definition: "An open standard that allows AI models to securely and consistently access data from any source (DBs, APIs, Files)." },
                  { term: "Multi-Agent System (MAS)", definition: "An architecture where multiple specialized AI agents collaborate, often with a 'Manager' agent orchestrating the workflow." },
                  { term: "RAG (Retrieval-Augmented Generation)", definition: "Enhancing LLM responses by retrieving relevant information from private enterprise data sources before generation." },
                  { term: "Vector Database", definition: "A specialized database designed to store and search high-dimensional data (embeddings), enabling semantic search for AI." },
                  { term: "Grounding", definition: "The process of linking AI model responses to verifiable, real-world data sources to reduce hallucinations." }
                ].map((item, idx) => (
                  <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all group">
                    <h4 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{item.term}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Local Tech Hub Signal */}
          <section className="py-12 px-6 bg-blue-50 border-y border-blue-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">The Best GenAI and GCP Training in Hyderabad, Telangana</h3>
                  <p className="text-blue-600 font-medium">Empowering the HITEC City tech community with 2026-ready skills.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white rounded-lg border border-blue-100 text-sm font-bold text-blue-800">#1 in Hyderabad</div>
                <div className="px-4 py-2 bg-white rounded-lg border border-blue-100 text-sm font-bold text-blue-800">15+ Yrs Experience</div>
              </div>
            </div>
          </section>

      {/* About Us Section */}
      <section id="about-us" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/instructor/800/1000" 
                  alt="Ajay Kumar - AI & Big Data Architect" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-100 rounded-full blur-3xl -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Architecting the Future</h3>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                  Meet Ajay Kumar: <br />
                  <span className="text-gray-500">15 Years of Engineering Excellence</span>
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  With over a decade and a half of specialized experience in <span className="text-gray-900 font-semibold">Big Data Architectures, Machine Learning, and Artificial Intelligence</span>, Ajay Kumar has been at the forefront of the technological shift toward autonomous systems.
                </p>
                <p>
                  His pedagogical approach is strictly <span className="text-gray-900 font-semibold">production-oriented</span>, mirroring the day-to-day operational lifecycle of a senior developer. Every module is designed to bridge the gap between theoretical frameworks and enterprise-grade implementation.
                </p>
                <p>
                  Ajay's mentorship has empowered a global cohort of engineers who now occupy <span className="text-gray-900 font-semibold">strategic leadership positions</span> across the IT landscape. He offers versatile engagement models, including high-impact <span className="text-gray-900 font-semibold">B2B and B2C training</span>, tailored for both individualized one-to-one deep dives and collaborative team-based upskilling.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
                  <div className="text-sm text-gray-500 font-medium">Years Experience</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">5k+</div>
                  <div className="text-sm text-gray-500 font-medium">Global Alumni</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Get In Touch</h3>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Let's Discuss Your <br /><span className="text-blue-600">AI & Data Strategy</span></h2>
              <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                Whether you're looking for individualized mentorship or enterprise-scale team training, we're here to help you navigate the complex landscape of Agentic AI and Big Data.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                    <p className="text-gray-500">ajay.ai.spoc@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Global Training</h4>
                    <p className="text-gray-500">Available for B2B & B2C worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

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
                <img src="/mylogo.png" alt="GenAI ChatGPT Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
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
                <li>
                  <button 
                    onClick={() => scrollToTab('curriculum')}
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    TRAINING CONTENT
                  </button>
                </li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li>
                  <button 
                    onClick={() => scrollToSection('about-us')}
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
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
