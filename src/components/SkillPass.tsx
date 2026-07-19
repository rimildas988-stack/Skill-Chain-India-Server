import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, Education, Experience } from '../types';
import { ReputationProgress } from './ReputationProgress';
import { 
  Shield, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  Award, 
  Code, 
  Globe, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Copy, 
  Plus, 
  Edit, 
  Trash, 
  X, 
  CheckCircle2, 
  Download,
  AlertCircle
} from 'lucide-react';

interface SkillPassProps {
  studentId?: string;
  onBack: () => void;
  isOwnProfile?: boolean;
}

export const SkillPass: React.FC<SkillPassProps> = ({ studentId, onBack, isOwnProfile = false }) => {
  const { students, currentStudent, updateStudentProfile, walletConnected, connectWallet } = useApp();

  // Find target student
  const student = students.find(s => s.id === (studentId || currentStudent?.id)) || currentStudent || students[0];

  const isSelf = isOwnProfile || student.id === 'student-current';

  // Toggle Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editSchool, setEditSchool] = useState(student.school);
  const [editSkills, setEditSkills] = useState((student.skills || []).join(', '));
  const [editAvailability, setEditAvailability] = useState(student.availability);
  const [portfolio, setPortfolio] = useState(student.portfolioUrl || '');
  const [github, setGithub] = useState(student.githubUrl || '');
  const [linkedin, setLinkedin] = useState(student.linkedinUrl || '');

  // Add Item States
  const [showEduModal, setShowEduModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const [showExpModal, setShowExpModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/skillpass/${student.id}`;
    navigator.clipboard.writeText(url);
    showToast("SkillPass verification link copied!");
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    showToast("Polygon transaction hash copied to clipboard!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name: editName,
      school: editSchool,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      availability: editAvailability,
      portfolioUrl: portfolio,
      githubUrl: github,
      linkedinUrl: linkedin,
    });
    setShowEditModal(false);
    showToast("Profile details updated successfully.");
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    const newEdu: Education = { schoolName, degree, fieldOfStudy, startYear, endYear };
    updateStudentProfile({
      education: [...(student.education || []), newEdu]
    });
    setShowEduModal(false);
    setSchoolName('');
    setDegree('');
    setFieldOfStudy('');
    setStartYear('');
    setEndYear('');
    showToast("Education item added.");
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: Experience = { companyName, role, duration, description };
    updateStudentProfile({
      experience: [...(student.experience || []), newExp]
    });
    setShowExpModal(false);
    setCompanyName('');
    setRole('');
    setDuration('');
    setDescription('');
    showToast("Experience logs added.");
  };

  const handleRemoveEdu = (idx: number) => {
    const list = [...(student.education || [])];
    list.splice(idx, 1);
    updateStudentProfile({ education: list });
    showToast("Education log removed.");
  };

  const handleRemoveExp = (idx: number) => {
    const list = [...(student.experience || [])];
    list.splice(idx, 1);
    updateStudentProfile({ experience: list });
    showToast("Experience log removed.");
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative" id="skillpass-page">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl border border-indigo-400 text-sm font-medium animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">SkillPass Profile</span>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 text-xs font-semibold border border-slate-800 transition cursor-pointer"
          >
            Back to Platform
          </button>
        </div>

        {/* Master Header Split: SkillPass card vs profile basics */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: Web3 Passport Card (SkillPass Visa) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-950 border border-purple-500/20 p-6 rounded-3xl relative overflow-hidden shadow-2xl" id="skillpass-passport-card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">SkillPass ID Registry</span>
                </div>
                <span className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-2.5 py-0.5 rounded text-[9px] font-mono">
                  POLYGON AMOY
                </span>
              </div>

              {/* Passport Body */}
              <div className="flex gap-4 items-center mb-6">
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/40" 
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                    {student.name}
                    {student.walletAddress && <CheckCircle2 className="w-4.5 h-4.5 text-purple-400 fill-purple-400/10" />}
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{student.school}</p>
                </div>
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900/60 font-mono text-center mb-6">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Reputation Points</span>
                  <span className="text-base font-bold text-slate-200">{student.reputation} pts</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Hiring Star Rating</span>
                  <span className="text-base font-bold text-amber-400">★ {student.rating}</span>
                </div>
              </div>

              {/* Reputation Level Progression */}
              <div className="mb-6">
                <ReputationProgress reputation={student.reputation} variant="compact" />
              </div>

              {/* Wallet Address Link */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Connected Wallet Node</span>
                {student.walletAddress ? (
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span className="truncate">{student.walletAddress}</span>
                    <button onClick={handleCopyLink} className="text-purple-400 hover:text-purple-300 ml-2">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
                    <p className="text-[11px] text-slate-500">No Web3 wallet linked to profile.</p>
                    {isSelf && (
                      <button 
                        onClick={() => connectWallet()}
                        className="text-[10px] font-bold bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                      >
                        Connect MetaMask
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* QR and Verification details */}
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>VERIFICATION STAMP: ACTIVE</span>
                <span className="text-purple-400 hover:underline cursor-pointer flex items-center gap-1" onClick={handleCopyLink}>
                  Copy Public Link <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Resume / Portfolio Quick Links */}
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Verify Documents</h4>
              <div className="space-y-2">
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); showToast("Simulated Resume PDF Download Initialized."); }}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs font-medium flex justify-between items-center transition"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-400" />
                    Verified_Resume_Alex.pdf
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: LinkedIn Profile Style Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bio Card / Social links */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4 relative">
              {isSelf && (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{student.name}</h2>
                <p className="text-sm text-slate-400">{student.school} • Academic Talent</p>
                <div className="flex items-center gap-2.5 pt-1.5">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                    AVAILABILITY: {student.availability}
                  </span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Skill Suite</span>
                <div className="flex flex-wrap gap-1.5">
                  {(student.skills || []).map(s => (
                    <span key={s} className="bg-slate-950 border border-slate-850 text-slate-300 px-3 py-1 rounded-xl text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social URLs */}
              <div className="flex gap-4 pt-3 text-slate-400 border-t border-slate-950/60 text-xs font-mono">
                {student.portfolioUrl && (
                  <a href={student.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition flex items-center gap-1">
                    <Globe className="w-4 h-4" /> Portfolio
                  </a>
                )}
                {student.githubUrl && (
                  <a href={student.githubUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition flex items-center gap-1">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {student.linkedinUrl && (
                  <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition flex items-center gap-1">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Achievements - Blockchain Credentials */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Verified Blockchain Credentials
              </h3>
              
              <div className="space-y-4">
                {(student.achievements || []).map(ach => (
                  <div 
                    key={ach.id}
                    className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-3 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                          {ach.title}
                          {ach.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">Issued by {ach.issuedBy} • {ach.issuedAt}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono ${ach.status === 'approved' ? 'bg-purple-900/20 text-purple-300' : 'bg-amber-900/20 text-amber-300'}`}>
                        {ach.status === 'approved' ? 'MINTED ON POLYGON' : 'VERIFICATION PENDING'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>

                    {ach.status === 'approved' && ach.transactionHash && (
                      <div className="flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-lg text-[10px] font-mono text-slate-500">
                        <span className="truncate">Tx Hash: {ach.transactionHash}</span>
                        <button 
                          onClick={() => handleCopyHash(ach.transactionHash || '')}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          Copy Hash <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience timeline */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  Freelancing & Professional Experience
                </h3>
                {isSelf && (
                  <button 
                    onClick={() => setShowExpModal(true)}
                    className="p-1.5 bg-slate-950 border border-slate-850 text-indigo-400 rounded hover:text-indigo-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!student.experience || student.experience.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No professional logs added yet.</p>
              ) : (
                <div className="space-y-4 relative pl-4 border-l border-slate-900">
                  {(student.experience || []).map((exp, i) => (
                    <div key={i} className="space-y-1 relative">
                      <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-slate-950" />
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-200">{exp.role}</h4>
                          <p className="text-xs text-indigo-400">{exp.companyName} • {exp.duration}</p>
                        </div>
                        {isSelf && (
                          <button onClick={() => handleRemoveExp(i)} className="text-rose-500/60 hover:text-rose-400">
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education timeline */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Education & Academic Qualifications
                </h3>
                {isSelf && (
                  <button 
                    onClick={() => setShowEduModal(true)}
                    className="p-1.5 bg-slate-950 border border-slate-850 text-purple-400 rounded hover:text-purple-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!student.education || student.education.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No academic logs uploaded yet.</p>
              ) : (
                <div className="space-y-4 pl-4 border-l border-slate-900 relative">
                  {(student.education || []).map((edu, i) => (
                    <div key={i} className="space-y-1 relative">
                      <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-slate-950" />
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-200">{edu.schoolName}</h4>
                          <p className="text-xs text-purple-400">{edu.degree} in {edu.fieldOfStudy}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{edu.startYear} - {edu.endYear}</p>
                        </div>
                        {isSelf && (
                          <button onClick={() => handleRemoveEdu(i)} className="text-rose-500/60 hover:text-rose-400">
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 w-full max-w-lg p-6 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold">Edit SkillPass Details</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase">Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase">Academic Center</label>
                  <input type="text" value={editSchool} onChange={e => setEditSchool(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Skill Suite (comma separated)</label>
                <input type="text" value={editSkills} onChange={e => setEditSkills(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase">Portfolio</label>
                  <input type="text" value={portfolio} onChange={e => setPortfolio(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase">GitHub</label>
                  <input type="text" value={github} onChange={e => setGithub(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase">LinkedIn</label>
                  <input type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Availability</label>
                <select value={editAvailability} onChange={e => setEditAvailability(e.target.value as Student['availability'])} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs cursor-pointer">
                  <option value="Part-time">Part-time Engagement</option>
                  <option value="Full-time">Full-time Commitment</option>
                  <option value="Intermittent">Intermittent Projects</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-xl text-xs font-bold transition">Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 w-full max-w-md p-6 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold">Add Academic Credential</h3>
            <form onSubmit={handleAddEducation} className="space-y-3.5">
              <input type="text" placeholder="School/College Name" required value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <input type="text" placeholder="Degree (e.g. Bachelor of Science)" required value={degree} onChange={e => setDegree(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <input type="text" placeholder="Field of Study (e.g. Computer Science)" required value={fieldOfStudy} onChange={e => setFieldOfStudy(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Start Year" required value={startYear} onChange={e => setStartYear(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
                <input type="text" placeholder="End Year (or Expected)" required value={endYear} onChange={e => setEndYear(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-xl text-xs font-bold transition">Add Academic Record</button>
                <button type="button" onClick={() => setShowEduModal(false)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 w-full max-w-md p-6 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold">Add Professional Log</h3>
            <form onSubmit={handleAddExperience} className="space-y-3.5">
              <input type="text" placeholder="Company/Client Name" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <input type="text" placeholder="Role/Task Title" required value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <input type="text" placeholder="Duration (e.g. 3 Months)" required value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <textarea placeholder="Description of contributions and tasks completed..." required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl text-xs font-bold transition">Add Professional Record</button>
                <button type="button" onClick={() => setShowExpModal(false)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
