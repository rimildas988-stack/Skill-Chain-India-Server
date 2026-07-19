import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Send, 
  RefreshCw, 
  Search, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Check, 
  AlertTriangle, 
  FileText, 
  User, 
  ArrowLeft,
  Loader,
  Calendar,
  Lock,
  MessageSquare,
  X
} from 'lucide-react';

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessageDetail {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  payload: {
    headers: GmailMessageHeader[];
    body?: {
      data?: string;
    };
    parts?: any[];
  };
}

export const GmailCenter: React.FC = () => {
  const { 
    gmailAccessToken, 
    signInWithGoogle, 
    currentUser,
    currentRole,
    currentStudent,
    currentCompany,
    opportunities,
    students
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<GmailMessageDetail[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Compose Fields
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const triggerToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to decode Gmail base64
  const decodeBase64 = (str: string) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (e) {
      try {
        return atob(base64);
      } catch (err) {
        return "Unable to decode message body.";
      }
    }
  };

  // Extract body from MIME parts
  const getMessageBody = (payload: any): string => {
    if (!payload) return "";
    if (payload.body && payload.body.data) {
      return decodeBase64(payload.body.data);
    }
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === "text/html" && part.body && part.body.data) {
          return decodeBase64(part.body.data);
        }
      }
      for (const part of payload.parts) {
        if (part.mimeType === "text/plain" && part.body && part.body.data) {
          return decodeBase64(part.body.data);
        }
      }
      for (const part of payload.parts) {
        if (part.parts) {
          const res = getMessageBody(part);
          if (res) return res;
        }
      }
    }
    return "";
  };

  const getHeader = (headers: GmailMessageHeader[] | undefined, name: string): string => {
    if (!headers) return '';
    const h = headers.find(header => header.name.toLowerCase() === name.toLowerCase());
    return h ? h.value : '';
  };

  // Fetch Inbox messages
  const fetchMessages = async (query = '') => {
    if (!gmailAccessToken) return;
    setLoading(true);
    try {
      let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15';
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${gmailAccessToken}` }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (!data.messages || data.messages.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Fetch detail for each message
      const detailPromises = data.messages.map(async (msg: { id: string }) => {
        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { Authorization: `Bearer ${gmailAccessToken}` }
        });
        return detailRes.ok ? await detailRes.json() : null;
      });

      const details = await Promise.all(detailPromises);
      setMessages(details.filter(d => d !== null));
    } catch (e: any) {
      console.error("Gmail fetch error:", e);
      triggerToast("Error accessing Gmail Inbox. Your token might have expired. Please re-authenticate.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch messages on connection
  useEffect(() => {
    if (gmailAccessToken) {
      fetchMessages();
    }
  }, [gmailAccessToken]);

  // Handle Send Email with confirmation dialog (MANDATORY)
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      triggerToast("Please fill in all composition fields.", 'info');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to send this email via your authenticated Gmail account to ${to}?\n\nSubject: ${subject}`
    );
    if (!confirmed) return;

    setSending(true);
    try {
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/html; charset="UTF-8"`,
        '',
        `<div>
          <p>${body.replace(/\n/g, '<br/>')}</p>
          <br/>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #888;">Sent securely via Skill Chain India Gig Mail Integration.</p>
         </div>`
      ].join('\r\n');

      const base64Safe = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64Safe })
      });

      if (!res.ok) {
        throw new Error('Gmail sending failed');
      }

      triggerToast(`Email successfully sent to ${to}!`);
      setShowCompose(false);
      setTo('');
      setSubject('');
      setBody('');
      fetchMessages();
    } catch (error) {
      console.error("Gmail send error:", error);
      triggerToast("Failed to send email. Check recipient address and permissions.", "error");
    } finally {
      setSending(false);
    }
  };

  // Handle Save Draft with confirmation dialog
  const handleSaveDraft = async () => {
    if (!to || !subject || !body) {
      triggerToast("Fill in composition fields to save draft.", 'info');
      return;
    }

    const confirmed = window.confirm(`Save this email as a draft in your Gmail account?`);
    if (!confirmed) return;

    setSending(true);
    try {
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/html; charset="UTF-8"`,
        '',
        `<div><p>${body.replace(/\n/g, '<br/>')}</p></div>`
      ].join('\r\n');

      const base64Safe = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: {
            raw: base64Safe
          }
        })
      });

      if (!res.ok) {
        throw new Error('Gmail draft save failed');
      }

      triggerToast("Draft successfully saved to your Gmail folder!");
      setShowCompose(false);
      setTo('');
      setSubject('');
      setBody('');
    } catch (error) {
      console.error("Draft error:", error);
      triggerToast("Failed to save draft.", "error");
    } finally {
      setSending(false);
    }
  };

  // Delete/Trash message with confirmation (MANDATORY)
  const handleDeleteMessage = async (msgId: string, subjectText: string) => {
    const confirmed = window.confirm(`Are you sure you want to move this email to trash?\n\nSubject: "${subjectText}"`);
    if (!confirmed) return;

    try {
      const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}/trash`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${gmailAccessToken}` }
      });

      if (!res.ok) {
        throw new Error('Failed to trash email');
      }

      triggerToast("Email moved to trash successfully.");
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Gmail trash error:", error);
      triggerToast("Failed to move email to trash.", "error");
    }
  };

  // Auto-populate compose values for gig recruiters or student builders
  const openComposeTo = (emailAddress: string, defaultSubject: string) => {
    setTo(emailAddress);
    setSubject(defaultSubject);
    setBody(`Hello,\n\nI am contacting you regarding our project on Skill Chain India Student Gig Marketplace.\n\nBest regards,\n${currentUser?.displayName || 'Web3 Builder'}`);
    setShowCompose(true);
  };

  // Render Gmail Authenticated UI
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8" id="gmail-center">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border flex items-center gap-3 shadow-2xl transition duration-300 animate-in fade-in slide-in-from-bottom-4 ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
          toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-300' :
          'bg-cyan-950/90 border-cyan-500/30 text-cyan-300'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span className="text-xs font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-white">
            <Mail className="w-8 h-8 text-cyan-400" />
            Skill Chain India Gig Mail
          </h1>
          <p className="text-slate-400 text-sm">
            Sync, read, and write official communications with Web3 builders and recruiters via Google Gmail API.
          </p>
        </div>

        {/* Authenticated user pill or sign-in */}
        {gmailAccessToken ? (
          <div className="flex items-center gap-3">
            <div className="bg-cyan-950/20 border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-xs text-cyan-300">
                Gmail API Connected
              </span>
            </div>
            <button 
              onClick={() => fetchMessages()}
              disabled={loading}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition cursor-pointer"
              title="Refresh Inbox"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowCompose(true)}
              className="bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Compose Email
            </button>
          </div>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="gsi-material-button hover:opacity-90 transition duration-150 cursor-pointer"
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents font-semibold text-xs">Connect Gmail Account</span>
            </div>
          </button>
        )}
      </div>

      {/* Gmail locked/Disconnected state */}
      {!gmailAccessToken ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-6" id="gmail-disconnected">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/20">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">Gmail Connection Required</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              We require Google authentication to authorize access to send, compose, and retrieve your gig communications directly through Gmail.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={signInWithGoogle}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl text-xs shadow-lg transition cursor-pointer"
            >
              Sign In & Grant Gmail Permissions
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Skill Chain India strictly secures your access token in-memory and will never store or leak your credentials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Quick-Contact Helper Rails */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Gig Partners Contacts
              </h3>
              
              <div className="space-y-2.5">
                {currentRole === 'company' ? (
                  // Show students to contact
                  students.slice(0, 5).map(s => (
                    <button
                      key={s.id}
                      onClick={() => openComposeTo(s.email, `Skill Chain India Gig Opportunity Update - ${currentCompany?.name}`)}
                      className="w-full text-left bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2.5 rounded-xl transition flex items-center gap-3 group"
                    >
                      <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover border border-cyan-500/20" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-400 transition">{s.name}</p>
                        <p className="text-[9px] text-slate-500 truncate font-mono">{s.email}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  // Show opportunities companies to contact
                  opportunities.slice(0, 5).map(o => (
                    <button
                      key={o.id}
                      onClick={() => openComposeTo("recruiter@skillchainindia.org", `Application Inquiry: ${o.title}`)}
                      className="w-full text-left bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2.5 rounded-xl transition flex items-center gap-3 group"
                    >
                      <img src={o.companyLogo} alt={o.companyName} className="w-7 h-7 rounded-full object-cover border border-cyan-500/20" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-400 transition">{o.companyName}</p>
                        <p className="text-[9px] text-slate-500 truncate font-mono">recruiter@skillchainindia.org</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-cyan-950/10 border border-cyan-500/10 rounded-2xl p-5 space-y-2.5">
              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Security Warning
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Always ensure you verify the email headers before taking action on payments or project feedback. Official administrators will communicate exclusively through <strong>support@skillchainindia.com</strong>.
              </p>
            </div>
          </div>

          {/* Core Mail Center view */}
          <div className="lg:col-span-9 flex flex-col space-y-6">
            
            {/* Search filter bar */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-2xl">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search Inbox (e.g. from:support, 'contract', etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMessages(searchQuery)}
                className="bg-transparent border-0 text-slate-200 text-xs w-full focus:outline-none focus:ring-0 placeholder:text-slate-500 py-2.5"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); fetchMessages(); }}
                  className="text-slate-500 hover:text-white text-xs font-mono px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => fetchMessages(searchQuery)}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition"
              >
                Search
              </button>
            </div>

            {/* Email list or reading view */}
            {selectedMessage ? (
              /* Reading Pane */
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 animate-in fade-in duration-200" id="email-detail-view">
                {/* Back controls */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Inbox
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => openComposeTo(
                        getHeader(selectedMessage.payload.headers, 'from').match(/<(.+)>/)?.[1] || getHeader(selectedMessage.payload.headers, 'from'),
                        `Re: ${getHeader(selectedMessage.payload.headers, 'subject')}`
                      )}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition cursor-pointer"
                      title="Reply"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMessage(selectedMessage.id, getHeader(selectedMessage.payload.headers, 'subject'))}
                      className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                      title="Trash Email"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Email Metadata */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white leading-snug">
                    {getHeader(selectedMessage.payload.headers, 'subject') || '(No Subject)'}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-black/35 border border-white/5 p-4 rounded-xl">
                    <div className="space-y-1">
                      <p className="text-slate-400">
                        From: <span className="text-white font-medium">{getHeader(selectedMessage.payload.headers, 'from')}</span>
                      </p>
                      <p className="text-slate-400">
                        To: <span className="text-slate-300">{getHeader(selectedMessage.payload.headers, 'to')}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      {getHeader(selectedMessage.payload.headers, 'date')}
                    </div>
                  </div>
                </div>

                {/* Body display */}
                <div className="bg-black/25 border border-white/5 rounded-xl p-5 overflow-auto text-slate-300 text-sm leading-relaxed max-h-[450px]">
                  {getMessageBody(selectedMessage.payload) ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: getMessageBody(selectedMessage.payload) }} 
                      className="prose prose-invert prose-xs max-w-full"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{selectedMessage.snippet}</p>
                  )}
                </div>
              </div>
            ) : (
              /* Inbox Message List */
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden" id="email-list-view">
                <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    Recent Inbox Messages
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {messages.length} messages loaded
                  </span>
                </div>

                {loading ? (
                  <div className="py-24 text-center space-y-3">
                    <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-mono">Synchronizing with Gmail Secure Server...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-20 text-center space-y-2">
                    <Mail className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">Your gig communication inbox is empty</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">No Gmail messages found matching search requirements.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {messages.map((msg) => {
                      const from = getHeader(msg.payload.headers, 'from');
                      const subject = getHeader(msg.payload.headers, 'subject') || '(No Subject)';
                      const dateStr = getHeader(msg.payload.headers, 'date');
                      // Format simple date
                      const shortDate = dateStr ? dateStr.replace(/,\s\d{4}.*/, '').split(' ').slice(0, 3).join(' ') : '';
                      
                      return (
                        <div 
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className="px-6 py-4 hover:bg-white/5 transition flex items-start gap-4 cursor-pointer group"
                        >
                          <div className="w-8 h-8 bg-cyan-950/35 border border-cyan-500/15 text-cyan-400 flex items-center justify-center rounded-xl font-bold text-sm shrink-0 group-hover:bg-cyan-500 group-hover:text-black transition">
                            {from.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs font-semibold text-slate-300 truncate group-hover:text-white transition">
                                {from.replace(/<.+>/, '').trim() || from}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono shrink-0">
                                {shortDate}
                              </p>
                            </div>
                            <p className="text-xs font-medium text-white truncate">
                              {subject}
                            </p>
                            <p className="text-xs text-slate-500 truncate font-mono">
                              {msg.snippet}
                            </p>
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 self-center transition" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" id="compose-modal">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                Compose Gig Mail
              </h3>
              <button 
                onClick={() => setShowCompose(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Recipient (To)</label>
                  <input 
                    type="email"
                    required
                    placeholder="builder@polygon.org or partner@stripe.com"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Subject</label>
                  <input 
                    type="text"
                    required
                    placeholder="Skill Chain India Gig: UI/UX Redesign Application Approved"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Message Body</label>
                  <textarea 
                    required
                    rows={8}
                    placeholder="Describe your gig update, provide contract links, or set meeting parameters..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Composition Controls */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={sending}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  Save Draft
                </button>
                <button 
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                >
                  {sending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
