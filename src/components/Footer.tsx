import React from 'react';
import { IndianRupee, Twitter, Github, Linkedin, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-amber rounded-lg flex items-center justify-center text-brand-navy">
                <IndianRupee size={24} strokeWidth={3} />
              </div>
              <span className="text-2xl font-display font-extrabold">
                PocketSathi
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's first AI-powered personal finance coach built specifically for the UPI generation. Start your wealth journey today.
            </p>
            <div className="flex gap-4">
               <SocialLink icon={<Twitter />} />
               <SocialLink icon={<Linkedin />} />
               <SocialLink icon={<Github />} />
            </div>
          </div>

          <div>
             <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em] text-brand-amber">Platform</h4>
             <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#coach" className="hover:text-white transition-colors">AI Coach</a></li>
                <li><a href="#upi" className="hover:text-white transition-colors">UPI Analyzer</a></li>
                <li><a href="#debt" className="hover:text-white transition-colors">Debt Detector</a></li>
                <li><a href="#investment" className="hover:text-white transition-colors">Goal Calculators</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em] text-brand-amber">Support</h4>
             <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-3"><Mail size={16} /> help@pocketsathi.in</li>
                <li className="flex items-center gap-3"><Phone size={16} /> +91 1800-FINTECH</li>
                <li className="flex items-center gap-3"><MapPin size={16} /> HSR Layout, Bengaluru</li>
             </ul>
          </div>

          <div className="space-y-6">
             <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em] text-brand-amber">Trust & Security</h4>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs uppercase">
                   <ShieldCheck size={18} /> Bank Grade Encryption
                </div>
                <p className="text-[10px] text-gray-500">Your data is stored locally on your device. We do not store sensitive information on our servers.</p>
             </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">
           <p>© 2026 PocketSathi Technologies Pvt Ltd.</p>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">RBI Regulations</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-amber hover:text-brand-navy hover:border-brand-amber transition-all">
       {React.cloneElement(icon as React.ReactElement, { size: 18 })}
    </a>
  );
}
