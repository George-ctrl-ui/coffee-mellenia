import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { api, ApiError } from '../services/api';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!subject.trim() || subject.trim().length < 2) {
      setErrorMessage('Please provide a subject.');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Message must be at least 5 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to send message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47A28] bg-[#1C120B]/90 px-3.5 py-1.5 rounded-full border border-[#F47A28]/40 shadow-xs rgb-frame">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#FFFDF8] tracking-tight">
            Contact & Café Location
          </h1>
          <p className="text-sm sm:text-base text-[#C5B5A5]">
            Questions about our specialty beans, event bookings, or feedback on your recent pickup? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#17100B]/90 backdrop-blur-md p-8 rounded-3xl border border-[#3E2818] space-y-6 rgb-frame rgb-glow shadow-xl">
              <h3 className="text-lg font-bold text-[#FFFDF8]">
                Coffee Mellenia Flagship
              </h3>

              <div className="space-y-4 text-xs text-[#C5B5A5]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#FFFDF8]">Address</div>
                    <div>Purok 3, San Francisco</div>
                    <div>Talibon, Bohol, Philippines</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#FFFDF8]">Opening Hours</div>
                    <div>Mon – Fri: 7:00 AM – 9:00 PM</div>
                    <div>Sat – Sun: 8:00 AM – 10:00 PM</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#FFFDF8]">Customer Support & Orders</div>
                    <div>+63 (02) 8812 3456</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#FFFDF8]">Email</div>
                    <div>hello@coffeemellenia.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder / Card */}
            <div className="bg-[#140E0A]/90 p-6 rounded-3xl border border-[#3E2818] shadow-md space-y-3 rgb-frame">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FFFDF8]">Directions & Parking</span>
                <span className="text-[#F47A28] font-semibold">Street & Mall Parking</span>
              </div>
              <p className="text-xs text-[#A39082] leading-relaxed">
                Located right at Purok 3, San Francisco, Talibon, Bohol. Easy roadside motorcycle and vehicle parking with welcoming outdoor seating.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#17100B]/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#3E2818] shadow-xl rgb-frame rgb-glow">
              <h2 className="text-xl font-bold text-[#FFFDF8] mb-6">
                Send a Message
              </h2>

              {success ? (
                <div className="p-6 rounded-2xl bg-[#142318] border border-emerald-500/50 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-200">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                    Thank you for reaching out to Coffee Mellenia. Our team will review your message and reply via email shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-xs font-semibold text-emerald-400 underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Maria Santos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-xs sm:text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="maria.santos@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-xs sm:text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bean Wholesale or Catering Inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-xs sm:text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your thoughts, suggestions, or inquiry with our barista team..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-xs sm:text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] rgb-frame"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
