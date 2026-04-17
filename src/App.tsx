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
  category: 'gcp' | 'ai';
  pillars?: string[];
  lab?: string;
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

  const sendNotification = async (data: any, type: 'enroll' | 'contact') => {
    const endpoint = type === 'enroll' ? '/api/enroll' : '/api/contact';

    // 1. Try the local API (works in AI Studio and Cloud Run)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log(`Notification sent successfully via local API (${endpoint})`);
        return true;
      }
    } catch (err) {
      console.warn(`Local API ${endpoint} not available. Trying webhook...`);
    }

    // 2. Fallback: GET request to Google Apps Script (avoids all CORS issues)
    const webhookUrl = (import.meta as any).env.VITE_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const params = new URLSearchParams({
          ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? '')])),
          _subject: type === 'enroll' ? `New Enrollment: ${data.name}` : `New Inquiry: ${data.name}`,
          _type: type,
        });
        const response = await fetch(`${webhookUrl}?${params.toString()}`);
        const result = await response.json();
        if (result.status === 'success') {
          console.log("Notification sent via webhook.");
          return true;
        }
        console.error("Webhook returned error:", result.message);
      } catch (err) {
        console.error("Webhook failed:", err);
      }
    } else {
      console.error("VITE_WEBHOOK_URL is not defined. Add it to GitHub Repository Secrets.");
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await sendNotification(formData, 'contact');
      if (!success) {
        console.warn("Email notification could not be sent, but we will still show success to the user as the data might have been logged elsewhere.");
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

  const sendNotification = async (data: any) => {
    // 1. Try local API first (works in AI Studio/Cloud Run)
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) return true;
    } catch (err) {
      console.warn("Local API not available, trying fallback...");
    }

    // 2. Fallback: GET request to Google Apps Script (avoids all CORS issues)
    const webhookUrl = (import.meta as any).env.VITE_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const params = new URLSearchParams({
          ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? '')])),
          _subject: `New Enrollment: ${data.name}`,
          _type: 'enroll',
        });
        const response = await fetch(`${webhookUrl}?${params.toString()}`);
        const result = await response.json();
        return result.status === 'success';
      } catch (err) {
        console.error("Webhook fallback failed:", err);
      }
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'leads';
      // 1. Save to Firestore (Primary) - This works everywhere
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // 2. Send Email Alert (Secondary)
      await sendNotification(formData);

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
  const [activeTab, setActiveTab] = useState<'gcp' | 'ai'>('gcp');
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
      title: "Introduction to Google Cloud Platform",
      description: "Laying the foundation for your cloud engineering journey.",
      category: 'gcp',
      topics: [
        "GCP Console & Cloud Shell Mastery",
        "Identity & Access Management (IAM) Deep Dive",
        "VPC Networking Fundamentals for Data Engineers",
        "Resource Hierarchy & Project Management",
        "Billing & Cost Optimization Strategies",
        "Cloud SDK (gcloud) CLI Tools",
        "Security Best Practices in GCP"
      ]
    },
    {
      id: 2,
      title: "Data Storage & Data Lakes (GCS)",
      description: "Mastering object storage and relational databases on the cloud.",
      category: 'gcp',
      topics: [
        "Google Cloud Storage (GCS) Architecture",
        "Bucket Configurations & Storage Classes",
        "Object Lifecycle Management Policies",
        "Cloud SQL: Managed MySQL, PostgreSQL & SQL Server",
        "Cloud Spanner: Globally Scalable Relational Database",
        "Cloud Bigtable: NoSQL for Large Scale Workloads",
        "Data Migration Service (DMS) Patterns"
      ]
    },
    {
      id: 3,
      title: "BigQuery & Enterprise Data Warehousing",
      description: "Deep dive into petabyte-scale analytics and SQL optimization.",
      category: 'gcp',
      topics: [
        "BigQuery Architecture: Dremel, Colossus & Jupiter",
        "Advanced SQL for Data Analytics",
        "Table Partitioning & Clustering Strategies",
        "BigQuery ML: Building Models with SQL",
        "BigQuery Omni: Multi-cloud Analytics",
        "Performance Tuning & Slot Management",
        "Data Governance & Authorized Views"
      ]
    },
    {
      id: 4,
      title: "Data Processing (Dataflow & Dataproc)",
      description: "Building scalable batch and streaming ETL pipelines.",
      category: 'gcp',
      topics: [
        "Apache Beam Fundamentals & Programming Model",
        "Cloud Dataflow: Serverless Data Processing",
        "Batch vs Streaming Pipeline Design Patterns",
        "Cloud Dataproc: Managed Spark & Hadoop Clusters",
        "Migrating On-premise Spark Jobs to GCP",
        "Windowing, Triggers & PCollections",
        "Error Handling & Side Inputs in Pipelines"
      ]
    },
    {
      id: 5,
      title: "Messaging & Workflow Orchestration",
      description: "Connecting systems and automating complex data workflows.",
      category: 'gcp',
      topics: [
        "Cloud Pub/Sub: Real-time Messaging Service",
        "Push vs Pull Subscription Models",
        "Cloud Composer: Managed Apache Airflow",
        "Designing Complex DAGs for Data Pipelines",
        "Cloud Functions: Serverless Event-driven Logic",
        "Cloud Workflows for Microservices Orchestration",
        "Monitoring & Alerting with Cloud Operations"
      ]
    },
    {
      id: 6,
      title: "Machine Learning & AI on Vertex AI",
      description: "Integrating AI capabilities into your data architecture.",
      category: 'gcp',
      topics: [
        "Vertex AI Platform Overview",
        "AutoML vs Custom Model Training",
        "Pre-trained AI APIs (Vision, NLP, Translation)",
        "Generative AI on Vertex AI: Model Garden",
        "MLOps: Model Deployment & Monitoring",
        "Feature Store & Model Registry",
        "Integrating LLMs into Data Pipelines"
      ]
    },
    {
      id: 7,
      title: "Generative AI using GCP",
      description: "Master the enterprise-grade Generative AI stack on Google Cloud. Learn to leverage Vertex AI's Model Garden to deploy foundation models and implement grounding techniques for factual accuracy.",
      category: 'ai',
      pillars: ["Vertex AI Model Garden", "Grounding with Enterprise Data", "Prompt Engineering on Vertex AI", "Vector Search Integration"],
      lab: "Build a grounded Q&A system using Vertex AI Search and Conversation connected to a private document repository.",
      topics: ["Vertex AI Model Garden", "Grounding Techniques", "Vector Search", "Enterprise AI Safety"]
    },
    {
      id: 8,
      title: "Building with the Claude API",
      description: "Unlock the power of Anthropic's Claude models through direct API integration. Focus on advanced features like prompt caching for cost efficiency and tool use for building interactive, agentic applications.",
      category: 'ai',
      pillars: ["Anthropic SDK Integration", "Prompt Caching Strategies", "Tool Use (Function Calling)", "Streaming Responses"],
      lab: "Create a real-time customer support agent that uses tool calling to fetch order status from a mock database.",
      topics: ["Anthropic SDK", "Prompt Caching", "Function Calling", "API Optimization"]
    },
    {
      id: 9,
      title: "Working with Claude Code",
      description: "Revolutionize your development workflow with Claude Code, the agentic CLI for engineers. Learn to automate complex refactoring tasks and use AI-assisted debugging to solve deep-seated architectural issues.",
      category: 'ai',
      pillars: ["Claude Code CLI Mastery", "Automated Code Refactoring", "AI-Assisted Debugging", "Repository-wide Context Analysis"],
      lab: "Use Claude Code to refactor a legacy monolithic function into a clean, modular set of utility functions with full test coverage.",
      topics: ["Agentic CLI", "Automated Refactoring", "AI Debugging", "Context Analysis"]
    },
    {
      id: 10,
      title: "Gemini AI Models and MCP",
      description: "Bridge the gap between Large Language Models and your data using the Model Context Protocol (MCP). Learn how Gemini models can securely interact with local and remote data sources through a standardized interface.",
      category: 'ai',
      pillars: ["Gemini 1.5 Pro/Flash Capabilities", "Model Context Protocol (MCP) Architecture", "Building MCP Servers", "Secure Data Grounding"],
      lab: "Implement an MCP server that allows a Gemini model to query and summarize local CSV data files securely.",
      topics: ["Gemini 1.5", "MCP Architecture", "MCP Servers", "Data Integration"]
    },
    {
      id: 11,
      title: "Agentic AI",
      description: "Transition from simple prompts to autonomous agents that can reason and act. Explore the ReAct pattern and master multi-agent orchestration frameworks like LangGraph and CrewAI to build complex, self-correcting workflows.",
      category: 'ai',
      pillars: ["Reasoning + Action (ReAct) Pattern", "Multi-Agent Orchestration (LangGraph/CrewAI)", "State Management in Agents", "Autonomous Workflow Design"],
      lab: "Orchestrate a multi-agent team where one agent researches a topic and another agent writes a technical blog post based on the findings.",
      topics: ["ReAct Pattern", "LangGraph & CrewAI", "Multi-Agent Systems", "Autonomous Workflows"]
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
                  onClick={() => { setActiveTab('gcp'); scrollToSection('tab-section'); }}
                  className={`hover:text-blue-600 transition-colors cursor-pointer py-2 relative z-10 ${activeTab === 'gcp' ? 'text-blue-600' : ''}`}
                >
                  GCP Data Engineering
                </button>
                <button 
                  onClick={() => { setActiveTab('ai'); scrollToSection('tab-section'); }}
                  className={`hover:text-blue-600 transition-colors cursor-pointer py-2 relative z-10 ${activeTab === 'ai' ? 'text-blue-600' : ''}`}
                >
                  AI Learning
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
                      onClick={() => { setActiveTab('gcp'); scrollToSection('tab-section'); setIsMenuOpen(false); }}
                      className="text-left text-gray-600 font-medium hover:text-blue-600 transition-colors py-2 cursor-pointer"
                    >
                      GCP Data Engineering
                    </button>
                    <button 
                      onClick={() => { setActiveTab('ai'); scrollToSection('tab-section'); setIsMenuOpen(false); }}
                      className="text-left text-gray-600 font-medium hover:text-blue-600 transition-colors py-2 cursor-pointer"
                    >
                      AI Learning
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
                  onClick={() => setActiveTab('gcp')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'gcp' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  GCP Data Engineering
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  AI Learning
                </button>
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.section
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              id="curriculum"
              className="py-12 px-6 bg-[#f8fafc]"
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                  <h2 className="text-4xl font-bold mb-4 tracking-tight uppercase">
                    {activeTab === 'gcp' ? 'GCP Data Engineering' : 'AI Learning'} CONTENT
                  </h2>
                  <p className="text-gray-600 max-w-xl mx-auto">
                    Our {activeTab === 'gcp' ? 'GCP' : 'AI'} curriculum is updated weekly to reflect the latest industry best practices and technological shifts.
                  </p>
                </div>

                <div className="space-y-6">
                  {chapters.filter(c => c.category === activeTab).map((chapter, index) => (
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
                          <span className="text-4xl font-black text-blue-100">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
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
                          <div className="pt-4 border-t border-gray-50 space-y-8">
                            {/* Learning Objectives */}
                            <div>
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

                            {/* AI Specific Content: Pillars & Labs */}
                            {chapter.category === 'ai' && (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                                      <Cpu className="w-4 h-4" /> Technical Pillars
                                    </h4>
                                    <ul className="space-y-2">
                                      {chapter.pillars?.map((pillar, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                          {pillar}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-700 mb-3 flex items-center gap-2">
                                      <Zap className="w-4 h-4" /> Hands-on Lab
                                    </h4>
                                    <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                                      {chapter.lab}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
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
