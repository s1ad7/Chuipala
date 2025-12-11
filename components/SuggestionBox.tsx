import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, CheckCircle2, Film, Tv, Gamepad2, X, MessageSquare, AlertCircle, User } from 'lucide-react';

const SuggestionBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggest' | 'contact'>('suggest');
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    movie: '',
    show: '',
    game: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', movie: '', show: '', game: '', message: '' });
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {};
    
    // Optional Name
    if (formData.name.trim()) payload.name = formData.name;

    // Collect Suggestions
    if (formData.movie.trim()) payload.movie = formData.movie;
    if (formData.show.trim()) payload.tv_show = formData.show;
    if (formData.game.trim()) payload.game = formData.game;
    
    // Collect Message
    if (formData.message.trim()) payload.message = formData.message;

    const hasSuggestions = !!(payload.movie || payload.tv_show || payload.game);
    const hasMessage = !!payload.message;

    // Safety check
    if (!hasSuggestions && !hasMessage) return;

    // Determine subject based on content
    if (hasSuggestions && hasMessage) {
        payload._subject = "New Suggestion & Contact (Portfolio)";
    } else if (hasSuggestions) {
        payload._subject = "New Suggestion (Portfolio)";
    } else {
        payload._subject = "New Contact Message (Portfolio)";
    }

    setStatus('submitting');

    try {
        const response = await fetch("https://formspree.io/f/manrljyl", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            setStatus('success');
            // Auto close after success
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
            }, 3000);
        } else {
            setStatus('error');
        }
    } catch (error) {
        setStatus('error');
    }
  };

  // If closed, show the trigger button
  if (!isOpen) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all group"
        >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium uppercase tracking-widest opacity-60 group-hover:opacity-100">Click to leave a mark</span>
        </motion.button>
    );
  }

  // Determine button disable state
  // We disable if the current tab's required fields are empty to prevent confusion,
  // even if the other tab has data. This ensures the user is conscious of what they are sending "now".
  const isSubmitDisabled = status === 'submitting' || 
    (activeTab === 'suggest' 
        ? (!formData.movie.trim() && !formData.show.trim() && !formData.game.trim()) 
        : !formData.message.trim());

  return (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="relative w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-1 sm:p-2"
    >
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#FF4655] rounded-full" />
                    Make your mark
                </h3>
                <button 
                    onClick={() => { setIsOpen(false); resetForm(); }} 
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {status === 'success' ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                >
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Received!</h4>
                    <p className="text-gray-400 text-sm">Thanks for stopping by.</p>
                </motion.div>
            ) : status === 'error' ? (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                >
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Failed to send</h4>
                    <p className="text-gray-400 text-sm mb-4">Something went wrong.</p>
                    <button 
                        onClick={() => setStatus('idle')}
                        className="text-xs uppercase tracking-widest text-[#FF4655] hover:text-white transition-colors"
                    >
                        Try Again
                    </button>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mode Toggle Tabs */}
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => setActiveTab('suggest')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${
                                activeTab === 'suggest' 
                                ? 'bg-white text-black shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            Suggest
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('contact')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${
                                activeTab === 'contact' 
                                ? 'bg-white text-black shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Contact
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 min-h-[180px]">
                        {/* Optional Name */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                            </div>
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="Your name (optional)"
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.03] transition-all"
                            />
                        </div>
                        <AnimatePresence mode="wait">
                            {activeTab === 'suggest' ? (
                                <motion.div
                                    key="suggest"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-3"
                                >
                                    {/* Movie Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Film className="w-4 h-4 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                        </div>
                                        <input 
                                            name="movie"
                                            value={formData.movie}
                                            onChange={handleInputChange}
                                            type="text" 
                                            placeholder="Suggest a Movie..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.03] transition-all"
                                        />
                                    </div>

                                    {/* TV Show Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Tv className="w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input 
                                            name="show"
                                            value={formData.show}
                                            onChange={handleInputChange}
                                            type="text" 
                                            placeholder="Suggest a TV Show..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.03] transition-all"
                                        />
                                    </div>

                                    {/* Game Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Gamepad2 className="w-4 h-4 text-gray-500 group-focus-within:text-[#FF4655] transition-colors" />
                                        </div>
                                        <input 
                                            name="game"
                                            value={formData.game}
                                            onChange={handleInputChange}
                                            type="text" 
                                            placeholder="Suggest a Game..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4655]/50 focus:bg-white/[0.03] transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 text-center pt-1 font-mono">* Fill one or more</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="contact"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    {([formData.movie, formData.show, formData.game].some(v => v.trim())) && (
                                        <div className="mb-4 bg-white/[0.03] border border-white/10 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF4655] animate-pulse" />
                                                <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">You will also send your suggestions</p>
                                            </div>
                                            <div className="space-y-2">
                                                {formData.movie.trim() && (
                                                    <div className="flex items-center gap-2 text-sm text-white">
                                                        <Film className="w-4 h-4 text-yellow-400" />
                                                        <span className="font-medium">Movie:</span>
                                                        <span className="text-gray-300 truncate">{formData.movie}</span>
                                                    </div>
                                                )}
                                                {formData.show.trim() && (
                                                    <div className="flex items-center gap-2 text-sm text-white">
                                                        <Tv className="w-4 h-4 text-blue-400" />
                                                        <span className="font-medium">TV Show:</span>
                                                        <span className="text-gray-300 truncate">{formData.show}</span>
                                                    </div>
                                                )}
                                                {formData.game.trim() && (
                                                    <div className="flex items-center gap-2 text-sm text-white">
                                                        <Gamepad2 className="w-4 h-4 text-[#FF4655]" />
                                                        <span className="font-medium">Game:</span>
                                                        <span className="text-gray-300 truncate">{formData.game}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        placeholder="Type your message here..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4655]/50 focus:bg-white/[0.03] transition-all resize-none leading-relaxed"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        {status === 'submitting' ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>{activeTab === 'suggest' ? 'Send Suggestions' : 'Send Message'}</span>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    </motion.div>
  );
};

export default SuggestionBox;
