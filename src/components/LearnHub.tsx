import React, { useState } from 'react';
import { Search, BookOpen, PlayCircle, ChevronRight, CheckCircle2, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserData } from '../types';
import { BLOGS, COURSES } from '../constants';

interface LearnHubProps {
  currentUser: User | null;
  userData: UserData;
  onUpdateCourseProgress: (courseId: string, lessonId: string) => void;
  onLoginPrompt: () => void;
}

export default function LearnHub({ currentUser, userData, onUpdateCourseProgress, onLoginPrompt }: LearnHubProps) {
  const [search, setSearch] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<typeof BLOGS[0] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);

  const filteredBlogs = BLOGS.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.tag.toLowerCase().includes(search.toLowerCase()));
  const filteredCourses = COURSES.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const toggleLesson = (courseId: string, lessonId: string) => {
    if (!currentUser) return onLoginPrompt();
    onUpdateCourseProgress(courseId, lessonId);
  };

  const getProgress = (courseId: string) => {
    const completed = userData.courseProgress[courseId] || [];
    const total = COURSES.find(c => c.id === courseId)?.lessonsCount || 1;
    return Math.round((completed.length / total) * 100);
  };

  return (
    <section id="learn" className="flex-grow pt-8 pb-4 px-6 lg:px-8 bg-gray-50 dark:bg-brand-navy/50 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col overflow-y-auto pr-2 scrollbar-hide">
        <div className="text-center space-y-4 mb-12">
           <div className="flex items-center justify-center gap-3 text-brand-amber">
              <BookOpen size={28} />
              <h2 className="text-4xl font-display font-extrabold">Learn Hub</h2>
           </div>
           <p className="text-gray-500 max-w-2xl mx-auto">Master your money with our curated financial literacy guides and courses.</p>
           
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

        {/* Blogs Section */}
        <div className="space-y-8 mb-20">
           <div className="flex justify-between items-end">
              <h3 className="text-2xl font-display font-extrabold flex items-center gap-2">Recent Articles</h3>
              <button className="text-sm font-bold text-brand-amber hover:underline uppercase tracking-widest">View all</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {/* Courses Section */}
        <div className="space-y-8">
           <h3 className="text-2xl font-display font-extrabold">Finance Masterclasses</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                   <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <PlayCircle size={24} />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 dark:bg-white/10 px-3 py-1 rounded-full">{course.difficulty}</span>
                      </div>
                      <h4 className="text-xl font-display font-extrabold">{course.title}</h4>
                      
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                         <span>{course.lessonsCount} LESSONS</span>
                         {currentUser && (
                           <span className="text-emerald-500 font-extrabold">{getProgress(course.id)}% DONE</span>
                         )}
                      </div>

                      {currentUser && (
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-emerald-500 transition-all duration-500" 
                             style={{ width: `${getProgress(course.id)}%` }} 
                           />
                        </div>
                      )}

                      <button 
                        onClick={() => currentUser ? setSelectedCourse(course) : onLoginPrompt()} 
                        className="w-full py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-brand-amber group-hover:text-brand-navy group-hover:border-brand-amber transition-all"
                      >
                         {!currentUser && <Lock size={16} />}
                         {currentUser ? 'Continue Course' : 'Login to Start'}
                      </button>
                   </div>
                </div>
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

        {/* Course Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCourse(null)} className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white dark:bg-brand-navy rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-brand-navy p-8 text-white">
                   <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                   <h2 className="text-2xl font-display font-extrabold mb-2">{selectedCourse.title}</h2>
                   <p className="text-sm opacity-50">{selectedCourse.lessonsCount} LESSONS • {selectedCourse.difficulty}</p>
                </div>
                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                   {selectedCourse.lessons.map((lesson, idx) => {
                     const isCompleted = (userData.courseProgress[selectedCourse.id] || []).includes(lesson.id);
                     return (
                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-brand-amber/20 transition-all group">
                           <div className="flex items-center gap-4">
                              <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                              <span className={`text-sm font-bold ${isCompleted ? 'text-gray-400 line-through' : ''}`}>{lesson.title}</span>
                           </div>
                           <button 
                             onClick={() => toggleLesson(selectedCourse.id, lesson.id)}
                             className={`p-2 rounded-lg transition-colors ${isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-500'}`}
                           >
                              <CheckCircle2 size={24} />
                           </button>
                        </div>
                     );
                   })}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
