import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChevronRight, ChevronLeft, CheckCircle, Loader2, User, School, Users } from 'lucide-react';

const SPORTS = [
  'Cricket', 'Football', 'Basketball', 'Badminton', 'Kabaddi',
  'Volleyball', 'Hockey', 'Table Tennis', 'Athletics', 'Swimming',
  'Wrestling', 'Boxing', 'Tennis', 'Gymnastics', 'Kho Kho', 'Other',
];

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const INITIAL = {
  // Step 1 — Student
  fullName: '', age: '', gender: '', sport: '', otherSport: '', experience: '',
  // Step 2 — School
  schoolName: '', className: '', city: '',
  // Step 3 — Parent
  parentName: '', parentMobile: '', parentEmail: '',
};

const STEPS = [
  { label: 'Student Info',  icon: User },
  { label: 'School Info',   icon: School },
  { label: 'Parent Info',   icon: Users },
];

// ── Validation ───────────────────────────────
function validate(step, data) {
  const errs = {};
  if (step === 0) {
    if (!data.fullName.trim())   errs.fullName   = 'Full name is required';
    if (!data.age)               errs.age        = 'Age is required';
    else if (+data.age < 5 || +data.age > 20) errs.age = 'Age must be between 5 and 20';
    if (!data.gender)            errs.gender     = 'Please select a gender';
    if (!data.sport)             errs.sport      = 'Please select a sport';
    if (data.sport === 'Other' && !data.otherSport.trim()) errs.otherSport = 'Please specify the sport';
    if (!data.experience)        errs.experience = 'Please select experience level';
  }
  if (step === 1) {
    if (!data.schoolName.trim()) errs.schoolName = 'School name is required';
    if (!data.className)         errs.className  = 'Please select a class';
    if (!data.city.trim())       errs.city       = 'City is required';
  }
  if (step === 2) {
    if (!data.parentName.trim())    errs.parentName   = 'Guardian name is required';
    if (!data.parentMobile.trim())  errs.parentMobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(data.parentMobile)) errs.parentMobile = 'Enter a valid 10-digit Indian mobile number';
    if (data.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.parentEmail)) {
      errs.parentEmail = 'Enter a valid email address';
    }
  }
  return errs;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState(false);

  const set = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const next = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => { setErrors({}); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      // ── Duplicate check ──────────────────────────────────────────
      // Block if a registration with the same mobile number already exists.
      const mobileSnap = await getDocs(
        query(collection(db, 'registrations'), where('parentMobile', '==', data.parentMobile))
      );
      if (!mobileSnap.empty) {
        setSubmitError('A registration with this mobile number already exists. Please contact us if you need help.');
        setSubmitting(false);
        return;
      }

      // Also check email if one was provided.
      if (data.parentEmail.trim()) {
        const emailSnap = await getDocs(
          query(collection(db, 'registrations'), where('parentEmail', '==', data.parentEmail.trim()))
        );
        if (!emailSnap.empty) {
          setSubmitError('A registration with this email address already exists. Please contact us if you need help.');
          setSubmitting(false);
          return;
        }
      }
      // ────────────────────────────────────────────────────────────

      await addDoc(collection(db, 'registrations'), {
        ...data,
        sport: data.sport === 'Other' ? data.otherSport : data.sport,
        age: Number(data.age),
        createdAt: serverTimestamp(),
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setSubmitError('Something went wrong. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <SuccessScreen name={data.fullName} />;

  return (
    <div className="min-h-screen py-24 px-[5%]" style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 0%, rgba(25,15,55,0.5) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 10% 100%, rgba(70,25,5,0.3) 0%, transparent 55%), #0b0b0f' }}>
      <Link to="/" className="joint-back">Back to Home</Link>

      <div className="max-w-[620px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-label justify-center before:hidden mb-3">Join Sport Surge</div>
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.2rem)] font-black text-white tracking-tight leading-tight">
            Athlete <span className="text-[--accent]">Registration</span>
          </h1>
          <p className="text-[--text-secondary] text-sm mt-3">
            Fill in the details below to register your child as a Sport Surge athlete.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.label} className="flex items-center flex-1">
                <div className={`flex flex-col items-center gap-1.5 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                    ${done   ? 'bg-[--accent] border-[--accent]' :
                      active ? 'border-[--accent] bg-[rgba(255,94,0,0.1)]' :
                               'border-[--border] bg-[--bg-card]'}`}>
                    {done
                      ? <CheckCircle size={18} className="text-white" />
                      : <Icon size={16} className={active ? 'text-[--accent]' : 'text-[--text-muted]'} />}
                  </div>
                  <span className={`text-[0.65rem] font-semibold tracking-wider uppercase
                    ${active ? 'text-[--accent]' : done ? 'text-white' : 'text-[--text-muted]'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-2 mb-5 transition-all duration-500
                    ${done ? 'bg-[--accent]' : 'bg-[--border]'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="reg-card">
          {step === 0 && <Step1 data={data} set={set} errors={errors} />}
          {step === 1 && <Step2 data={data} set={set} errors={errors} />}
          {step === 2 && <Step3 data={data} set={set} errors={errors} />}

          {submitError && (
            <p className="mt-4 text-[0.8rem] text-red-400 text-center">{submitError}</p>
          )}

          {/* Navigation */}
          <div className={`flex mt-8 gap-3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
            {step > 0 && (
              <button className="reg-btn-secondary" onClick={back} disabled={submitting}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="reg-btn-primary" onClick={next}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button className="reg-btn-primary" onClick={submit} disabled={submitting}>
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                  : <>Submit Registration <CheckCircle size={16} /></>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[0.72rem] text-[--text-muted] mt-6">
          Your information is stored securely and will only be used for Sport Surge athlete management.
        </p>
      </div>
    </div>
  );
}

// ── Step 1: Student Info ──────────────────────
function Step1({ data, set, errors }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="reg-step-title"><User size={18} /> Student Information</h2>

      <Field label="Full Name" error={errors.fullName} required>
        <input className={`reg-input ${errors.fullName ? 'error' : ''}`}
          type="text" placeholder="e.g. Rahul Sharma"
          value={data.fullName} onChange={e => set('fullName', e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Age" error={errors.age} required>
          <input className={`reg-input ${errors.age ? 'error' : ''}`}
            type="number" placeholder="e.g. 14" min="5" max="20"
            value={data.age} onChange={e => set('age', e.target.value)} />
        </Field>

        <Field label="Gender" error={errors.gender} required>
          <select className={`reg-input ${errors.gender ? 'error' : ''}`}
            value={data.gender} onChange={e => set('gender', e.target.value)}>
            <option value="">Select…</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>
      </div>

      <Field label="Primary Sport" error={errors.sport} required>
        <select className={`reg-input ${errors.sport ? 'error' : ''}`}
          value={data.sport} onChange={e => set('sport', e.target.value)}>
          <option value="">Select a sport…</option>
          {SPORTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </Field>

      {data.sport === 'Other' && (
        <Field label="Specify Sport" error={errors.otherSport} required>
          <input className={`reg-input ${errors.otherSport ? 'error' : ''}`}
            type="text" placeholder="Enter sport name"
            value={data.otherSport} onChange={e => set('otherSport', e.target.value)} />
        </Field>
      )}

      <Field label="Experience Level" error={errors.experience} required>
        <div className="flex gap-3 flex-wrap">
          {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
            <label key={lvl} className={`reg-radio ${data.experience === lvl ? 'selected' : ''}`}>
              <input type="radio" name="experience" value={lvl} className="sr-only"
                checked={data.experience === lvl} onChange={() => set('experience', lvl)} />
              {lvl}
            </label>
          ))}
        </div>
        {errors.experience && <p className="field-error">{errors.experience}</p>}
      </Field>
    </div>
  );
}

// ── Step 2: School Info ───────────────────────
function Step2({ data, set, errors }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="reg-step-title"><School size={18} /> School Information</h2>

      <Field label="School Name" error={errors.schoolName} required>
        <input className={`reg-input ${errors.schoolName ? 'error' : ''}`}
          type="text" placeholder="e.g. Delhi Public School"
          value={data.schoolName} onChange={e => set('schoolName', e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Class / Grade" error={errors.className} required>
          <select className={`reg-input ${errors.className ? 'error' : ''}`}
            value={data.className} onChange={e => set('className', e.target.value)}>
            <option value="">Select…</option>
            {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </Field>

        <Field label="City" error={errors.city} required>
          <input className={`reg-input ${errors.city ? 'error' : ''}`}
            type="text" placeholder="e.g. New Delhi"
            value={data.city} onChange={e => set('city', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

// ── Step 3: Parent Info ───────────────────────
function Step3({ data, set, errors }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="reg-step-title"><Users size={18} /> Parent / Guardian Information</h2>

      <Field label="Parent / Guardian Name" error={errors.parentName} required>
        <input className={`reg-input ${errors.parentName ? 'error' : ''}`}
          type="text" placeholder="e.g. Suresh Sharma"
          value={data.parentName} onChange={e => set('parentName', e.target.value)} />
      </Field>

      <Field label="Mobile Number" error={errors.parentMobile} required>
        <div className="flex">
          <span className="reg-phone-prefix">+91</span>
          <input className={`reg-input flex-1 rounded-l-none border-l-0 ${errors.parentMobile ? 'error' : ''}`}
            type="tel" placeholder="9876543210" maxLength={10}
            value={data.parentMobile} onChange={e => set('parentMobile', e.target.value.replace(/\D/g, ''))} />
        </div>
        {errors.parentMobile && <p className="field-error">{errors.parentMobile}</p>}
      </Field>

      <Field label="Email Address" error={errors.parentEmail}>
        <input className={`reg-input ${errors.parentEmail ? 'error' : ''}`}
          type="email" placeholder="optional@email.com"
          value={data.parentEmail} onChange={e => set('parentEmail', e.target.value)} />
      </Field>

      {/* Summary Preview */}
      <div className="reg-summary">
        <p className="text-[0.7rem] text-[--accent] font-bold uppercase tracking-widest mb-3">Registration Summary</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[0.78rem]">
          <SummaryRow label="Name"     value={data.fullName} />
          <SummaryRow label="Age"      value={data.age ? `${data.age} yrs` : ''} />
          <SummaryRow label="Sport"    value={data.sport === 'Other' ? data.otherSport : data.sport} />
          <SummaryRow label="Level"    value={data.experience} />
          <SummaryRow label="School"   value={data.schoolName} />
          <SummaryRow label="Class"    value={data.className ? `Class ${data.className}` : ''} />
          <SummaryRow label="City"     value={data.city} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-[--text-muted]">{label}: </span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

// ── Reusable Field Wrapper ────────────────────
function Field({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.78rem] font-semibold text-[--text-secondary] tracking-wide">
        {label} {required && <span className="text-[--accent]">*</span>}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

// ── Success Screen ────────────────────────────
function SuccessScreen({ name }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-[5%] py-24" style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 0%, rgba(25,15,55,0.5) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 10% 100%, rgba(70,25,5,0.3) 0%, transparent 55%), #0b0b0f' }}>
      <div className="text-center max-w-[480px]">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[rgba(0,200,100,0.1)] border border-[rgba(0,200,100,0.3)] flex items-center justify-center">
          <CheckCircle size={40} className="text-[#00c864]" strokeWidth={1.5} />
        </div>
        <h1 className="font-[var(--font-display)] text-[clamp(1.8rem,5vw,2.8rem)] font-black text-white mb-3 tracking-tight">
          You're <span className="text-[#00c864]">Registered!</span>
        </h1>
        <p className="text-[--text-secondary] leading-[1.8] mb-8">
          Welcome to Sport Surge, <strong className="text-white">{name}</strong>! Your registration has been received. We'll be in touch soon.
        </p>
        <Link to="/" className="btn-primary inline-flex">← Back to Home</Link>
      </div>
    </div>
  );
}
