'use client';

import { useState } from 'react';
import { Star, Instagram, Linkedin, Twitter, Youtube, Facebook, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check for duplicate
      const { data: existing } = await supabase
        .from('newsletter')
        .select('id')
        .eq('email', email.trim())
        .single();

      if (existing) {
        toast({
          title: "Already on list",
          description: "You are already on our list!",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Insert new subscriber
      const { error } = await supabase.from('newsletter').insert({
        email: email.trim(),
        source: 'web-landing-page',
        status: 'subscribed',
        user_id: user?.id || null
      });

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "Successfully subscribed to the newsletter!",
      });
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter error:', error);
      toast({
        title: "Failed to subscribe",
        description: error.message || 'Please try again later.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full">

      {/* ===== TOP LIGHT SECTION ===== */}
      <div className="bg-[#efe6ea] py-16 px-6">
        <div className="max-w-7xl mx-auto px-2 md:px-12 lg:px-20 grid md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* BRAND + RATING */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PENTASENT
            </h2>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-semibold text-rose-400">4.5</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#f4a5a8] text-[#f4a5a8]"
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Join 2k+ humans all around the world, download the app and start your journey.
            </p>

            {/* <p className="text-sm text-gray-600 mb-3">
              Download the Pentasent app
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 w-fit sm:w-auto">
              <a href='/beta-release'>
                <div className="bg-[#3d2f4d] text-white px-6 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#4b2a3f] transition-colors">
                  <div className="text-md">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs">GET IT ON</p>
                    <p className="font-semibold text-sm">Google Play</p>
                  </div>
                </div>
              </a>
              <a href='/beta-release' >
                <div className="bg-[#3d2f4d] text-white px-6 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#4b2a3f] transition-colors">
                  <div className="text-md">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs">Download on the</p>
                    <p className="font-semibold text-sm">App Store</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Pentasent APP */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Pentasent
            </h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              {/* <li><a href='/beta-release' className='cursor-pointer'> Download the app</a></li> */}
              <li><a href='/#features' className='cursor-pointer'> How It Works</a></li>
              <li><a href='/#pricing' className='cursor-pointer'> Pricing Plans</a></li>
              <li><a href='/articles' className='cursor-pointer'> Library</a></li>
              <li><a href='/articles' className='cursor-pointer'> FAQs</a></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Company
            </h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href='/about' className='cursor-pointer'> About Us</a></li>
              <li><a href='/beta-release' className='cursor-pointer'> Community</a></li>
              <li><a href='/contact' className='cursor-pointer'> Contact</a></li>
            </ul>
          </div>

          {/* FOLLOW US */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Follow Us
            </h4>
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="">
                <a href='https://www.linkedin.com/company/pentasent' className='cursor-pointer inline-flex items-center gap-3'><Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </li>
              <li className="">
                <a href='https://www.youtube.com/@pentasent' className='cursor-pointer inline-flex items-center gap-3'><Youtube className="w-4 h-4" /> YouTube
                </a>
              </li>
              {/* <li className="">
                <a href='https://www.instagram.com/pentasent' className='cursor-pointer inline-flex items-center gap-3'><Instagram className="w-4 h-4" /> Instagram
                </a>
              </li> */}
              <li className="">
                <a href='https://www.facebook.com/pentasent' className='cursor-pointer inline-flex items-center gap-3'><Facebook className="w-4 h-4" /> Facebook
                </a>
              </li>
              <li className="">
                <a href='https://twitter.com/pentasent' className='cursor-pointer inline-flex items-center gap-3'><Twitter className="w-4 h-4" /> X (Twitter)
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ===== DARK NEWSLETTER SECTION ===== */}
      <div className="relative bg-[#4b2a3f] text-white py-24 px-6 overflow-hidden">

        <div className="relative max-w-3xl mx-auto text-center md:mb-40">

          <h3 className="text-4xl md:text-5xl font-light leading-tight mb-6">
            Soft support, right<br />when you need it
          </h3>

          <p className="text-sm text-white/70 mb-10">
            Get expert tips, fresh insights, and early access to features
            designed to support your journey.
          </p>

          {/* Newsletter Input */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-[400px] px-6 py-3 rounded-full bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full flex items-center gap-2 border border-white/40 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Subscribing...' : 'Subscribe to newsletter'}
            </button>
          </form>

          <p className="text-xs text-white/50">
            By subscribing you agree to our <a href='/privacy-policy' className='text-white'>Privacy Policy</a> and provide consent
            to receive updates from our company.
          </p>
        </div>

        {/* BIG BACKGROUND BRAND TEXT */}
        <div className="absolute md:-bottom-[8%] left-0 w-full text-[65px] md:text-[145px] xl:text-[240px] font-bold text-white/5 opacity-30 select-none pointer-events-none text-center">
          Pentasent
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bg-[#4b2a3f] text-white/70 text-xs py-6 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <span>© {currentYear} Pentasent. All rights reserved.</span>

          <div className="flex gap-6">
            <a href='/privacy-policy' className='cursor-pointer'>Privacy Policy</a>
            <a href='terms-and-conditions' className='cursor-pointer'>Terms of Service</a>
            <a href='children-policy' className='cursor-pointer'>Children Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
