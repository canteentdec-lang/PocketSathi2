import React, { useState } from 'react';
import { Search, BookOpen, PlayCircle, ChevronRight, CheckCircle2, Lock, X, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { User, UserData } from '../types';
import { BLOGS, COURSES } from '../constants';

interface LearnHubProps {
  currentUser: User | null;
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  onUpdateCourseProgress: (courseId: string, lessonId: string) => void;
  onLoginPrompt: () => void;
}

export default function LearnHub({ currentUser, userData, onUpdateUserData, onUpdateCourseProgress, onLoginPrompt }: LearnHubProps) {
  const [search, setSearch] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  
  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; content: string } | null>(null);

  // Combine static and user-generated blogs
  const allBlogs = [
    ...BLOGS,
    ...(userData.savedAiBlogs || []).map(b => ({
      ...b,
      tag: 'AI Generated',
      description: b.content.substring(0, 150) + '...'
    }))
  ];

  const suggestedBlogs = aiTopic.length > 2 
    ? allBlogs.filter(b => b.title.toLowerCase().includes(aiTopic.toLowerCase())).slice(0, 3)
    : [];

  const generateAIBlog = async () => {
    if (!aiTopic.trim()) return;
    if (!currentUser) return onLoginPrompt();
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short, engaging financial blog post about: ${aiTopic}. 
        Focus on the Indian context. 
        Format your response as a JSON object with 'title' and 'content' fields. 
        The content should be in markdown and around 150 words.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setAiResult(result);

      // Save to userData
      const newAiBlog = {
        id: Date.now().toString(),
        title: result.title,
        content: result.content,
        date: new Date().toISOString(),
        topic: aiTopic
      };

      onUpdateUserData({
        savedAiBlogs: [newAiBlog, ...(userData.savedAiBlogs || [])]
      });

    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredBlogs = allBlogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.tag.toLowerCase().includes(search.toLowerCase()));

  return (
    <section id="learn" className="flex-grow pt-8 pb-4 px-6 lg:px-8 bg-gray-50 dark:bg-brand-navy/50 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col overflow-y-auto pr-2 scrollbar-hide">
        <div className="text-center space-y-4 mb-12">
           <div className="flex items-center justify-center gap-3 text-brand-amber">
              <BookOpen size={28} />
              <h2 className="text-4xl font-display font-extrabold">Learn Hub</h2>
           </div>
           <p className="text-gray-500 max-w-2xl mx-auto">Master your money with our curated financial literacy guides and insights.</p>
           
           <div className="max-w-xl mx-auto pt-6 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-[10%] text-gray-400" size={20} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search: SIP, CIBIL, budgeting..."
                className="w-full bg-white dark:bg-brand-navy border-2 border-gray-100 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-brand-amber transition-all shadow-lg"
              />
           </div>
        </div>

        {/* AI Blog Maker */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-brand-amber/20 to-brand-amber/5 rounded-[2.5rem] p-8 md:p-12 border border-brand-amber/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={120} className="text-brand-amber" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 text-brand-amber mb-4">
                <Wand2 size={24} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">PocketSathi Labs</span>
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">AI Blog Maker</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Want to learn about something specific? Type a topic (e.g., "Digital Gold", "Credit card rewards", "Term insurance") and let our AI generate a personalized guide for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 relative">
                <div className="flex-grow relative">
                  <input 
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Enter a financial topic..."
                    className="w-full bg-white dark:bg-brand-navy border-2 border-transparent focus:border-brand-amber rounded-2xl px-6 py-4 outline-none shadow-sm transition-all"
                  />
                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {suggestedBlogs.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl z-20 overflow-hidden"
                      >
                        <div className="p-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Already on PocketSathi
                        </div>
                        {suggestedBlogs.map((blog) => (
                          <button
                            key={blog.id}
                            onClick={() => {
                              setSelectedBlog(blog);
                              setAiTopic('');
                            }}
                            className="w-full text-left p-4 hover:bg-brand-amber/10 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-bold text-sm">{blog.title}</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-amber transition-colors" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={generateAIBlog}
                  disabled={isGenerating || !aiTopic.trim()}
                  className="btn-primary px-8 py-4 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Insight'}
                </button>
              </div>

              <AnimatePresence>
                {aiResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-white dark:bg-brand-navy rounded-3xl p-8 border border-brand-amber/20 shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-display font-bold text-brand-amber">{aiResult.title}</h4>
                      <button onClick={() => setAiResult(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {aiResult.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Blogs Section */}
        <div className="space-y-8 mb-20">
           <div className="flex justify-between items-end">
              <h3 className="text-2xl font-display font-extrabold flex items-center gap-2">Articles & Insights</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <motion.div 
                  key={blog.id} 
                  layout 
                  className="glass-card card-glow flex flex-col items-start overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                >
                   <div className="p-8 space-y-4 w-full">
                      <span className="px-3 py-1 bg-brand-amber/10 text-brand-amber text-[10px] font-bold uppercase rounded-full tracking-wider border border-brand-amber/20">{blog.tag}</span>
                      <h4 className="text-xl font-display font-extrabold leading-tight group-hover:text-brand-amber transition-colors">{blog.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{blog.description}</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-brand-amber pt-2">
                         Read Story <ChevronRight size={16} />
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBlog(null)} className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white dark:bg-brand-navy rounded-3xl p-8 overflow-y-auto max-h-[80vh]">
                <button onClick={() => setSelectedBlog(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><X size={20} /></button>
                <div className="space-y-6 pt-4">
                   <span className="px-3 py-1 bg-brand-amber/10 text-brand-amber text-xs font-bold uppercase rounded-full">{selectedBlog.tag}</span>
                   <h2 className="text-3xl font-display font-extrabold">{selectedBlog.title}</h2>
                   <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap whitespace-normal">
                      {selectedBlog.content}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
