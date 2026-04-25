import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Bone, Dumbbell, Link as LinkIcon, AlertTriangle, HeartPulse, Check } from 'lucide-react';

const DATA = {
  nape: {
    name: 'Nape', tag: 'Cervical Spine',
    desc: 'The nape is the back of the neck, housing the cervical vertebrae that protect the spinal cord and allow head movement. Critical for contact sports and overhead athletes.',
    stats: [{ val: '7', label: 'Vertebrae' }, { val: 'C1–C7', label: 'Segments' }, { val: '70°', label: 'Rotation Range' }],
    anatomy: [
      { icon: Bone, name: 'Vertebrae C1–C7', desc: 'Bones forming the cervical column' },
      { icon: Dumbbell, name: 'Trapezius', desc: 'Supports neck and shoulder movement' },
      { icon: LinkIcon, name: 'Intervertebral Discs', desc: 'Cushion between each vertebra' },
    ],
    injuries: [
      { name: 'Cervical Strain (Whiplash)', desc: 'Sudden hyperextension of the neck, common in contact sports and collisions.' },
      { name: 'Herniated Cervical Disc', desc: 'Disc material pushes out and compresses nerves, causing pain down the arm.' },
      { name: 'Cervical Stenosis', desc: 'Narrowing of the spinal canal, often from repetitive overhead loading.' },
    ],
    fixes: [
      '<strong>RICE Protocol</strong> — Rest, Ice (20 min on/off), Compress, Elevate immediately after injury.',
      '<strong>Neck Mobility Drills</strong> — Gentle chin tucks and lateral flexion 2× daily to restore range of motion.',
      '<strong>Strengthening</strong> — Isometric resistance exercises (4 directions) to stabilize cervical muscles.',
      '<strong>Physiotherapy</strong> — Manual therapy and traction for disc-related issues; 4–8 week program.',
      '<strong>Posture Correction</strong> — Ergonomic adjustments and chin-tuck habit to prevent recurrence.',
    ],
  },
  shoulder: {
    name: 'Shoulder', tag: 'Glenohumeral Joint',
    desc: 'The most mobile joint in the body, the shoulder allows throwing, swinging, and overhead motions. Its wide range of motion makes it vulnerable to instability and overuse.',
    stats: [{ val: '360°', label: 'Mobility Arc' }, { val: '4', label: 'Rotator Cuff Muscles' }, { val: '#1', label: 'Most Dislocated Joint' }],
    anatomy: [
      { icon: Bone, name: 'Humerus Head', desc: 'Ball that sits in the glenoid socket' },
      { icon: LinkIcon, name: 'Labrum', desc: 'Cartilage ring stabilising the joint' },
      { icon: Dumbbell, name: 'Rotator Cuff', desc: 'SITS muscles: Supraspinatus, Infraspinatus, Teres Minor, Subscapularis' },
    ],
    injuries: [
      { name: 'Rotator Cuff Tear', desc: 'Partial or full tear of one of the four rotator cuff tendons, causing severe weakness.' },
      { name: 'Shoulder Impingement', desc: 'Tendons pinch under the acromion during overhead movements.' },
      { name: 'AC Joint Sprain', desc: 'Acromioclavicular joint separation from falls or direct contact.' },
    ],
    fixes: [
      '<strong>Pendulum Exercises</strong> — Gravity-assisted shoulder circles to decompress the joint early post-injury.',
      '<strong>Rotator Cuff Strengthening</strong> — External rotation with resistance band; 3×15 reps daily.',
      '<strong>Scapular Stabilisation</strong> — Wall slides, rows and Y-T-W raises to restore shoulder blade control.',
      '<strong>Anti-Inflammatory Protocol</strong> — NSAIDs + ice for the first 72 hours; consult a physician.',
      '<strong>Return-to-Sport Progression</strong> — Gradual throwing/overhead program from 8–12 weeks post-injury.',
    ],
  },
  elbow: {
    name: 'Elbow', tag: 'Humeroulnar Joint',
    desc: 'The elbow connects the upper and lower arm, enabling throwing, gripping, and racket sports. Overuse from repetitive motion is the leading cause of elbow problems in athletes.',
    stats: [{ val: '145°', label: 'Flexion Range' }, { val: '3', label: 'Articulating Bones' }, { val: '2', label: 'Main Ligaments' }],
    anatomy: [
      { icon: Bone, name: 'Humerus / Radius / Ulna', desc: 'Three bones forming the elbow' },
      { icon: LinkIcon, name: 'Medial Collateral Lig.', desc: 'Resists valgus stress during throwing' },
      { icon: Dumbbell, name: 'Brachialis / Biceps', desc: 'Primary flexors of the elbow' },
    ],
    injuries: [
      { name: 'Tennis Elbow (Lateral Epicondylitis)', desc: 'Overuse of forearm extensors causes pain at the outer elbow.' },
      { name: "Golfer's Elbow (Medial Epicondylitis)", desc: 'Inner elbow pain from repetitive wrist flexion and gripping.' },
      { name: 'UCL Tear', desc: 'Medial collateral ligament rupture in overhead throwing athletes.' },
    ],
    fixes: [
      '<strong>Eccentric Wrist Extensions</strong> — Slowly lower a light weight; 3×15 reps for tendon remodelling.',
      '<strong>Stretching</strong> — Forearm flexor and extensor stretches held 30 s, 3× daily.',
      '<strong>Grip Strengthening</strong> — Stress ball or hand gripper; progressive resistance over 6 weeks.',
      '<strong>Platelet-Rich Plasma (PRP)</strong> — Injection therapy for chronic tendinopathy; 70–80% success rate.',
      '<strong>Activity Modification</strong> — Reduce repetitive loading and correct throwing mechanics with a coach.',
    ],
  },
  wrist: {
    name: 'Wrist', tag: 'Radiocarpal Joint',
    desc: 'The wrist is a complex of eight carpal bones that transmit forces between the hand and forearm. Essential for every grip, catch, or racket-sport stroke.',
    stats: [{ val: '8', label: 'Carpal Bones' }, { val: '80°', label: 'Flexion Range' }, { val: '70°', label: 'Extension Range' }],
    anatomy: [
      { icon: Bone, name: 'Carpal Bones', desc: 'Scaphoid, lunate, triquetrum and 5 more' },
      { icon: LinkIcon, name: 'TFCC', desc: 'Triangular fibrocartilage complex — key stabiliser' },
      { icon: Dumbbell, name: 'Flexor Tendons', desc: 'Run through the carpal tunnel to fingers' },
    ],
    injuries: [
      { name: 'Scaphoid Fracture', desc: 'Most common wrist fracture; often missed on initial X-ray after a fall.' },
      { name: 'TFCC Tear', desc: 'Triangular fibrocartilage tear causing ulnar-side pain and clicking.' },
      { name: 'Carpal Tunnel Syndrome', desc: 'Compression of the median nerve causing numbness and tingling.' },
    ],
    fixes: [
      '<strong>Wrist Splinting</strong> — Neutral-position splint for 4–6 weeks for sprains and mild TFCC tears.',
      '<strong>Tendon Gliding Exercises</strong> — 5-position finger sequence to maintain carpal tunnel mobility.',
      '<strong>Strengthening</strong> — Wrist curls and rice bucket exercises for grip rehabilitation.',
      '<strong>Ultrasound Therapy</strong> — Therapeutic ultrasound reduces inflammation in tendon sheaths.',
      '<strong>Surgical Consult</strong> — Scaphoid non-unions or complete TFCC tears may require arthroscopic repair.',
    ],
  },
  lowerback: {
    name: 'Lower Back', tag: 'Lumbar Spine',
    desc: "The lumbar spine bears the full weight of the torso and transfers forces between the upper and lower body. The number one injury site for athletes across almost every sport.",
    stats: [{ val: '5', label: 'Lumbar Vertebrae' }, { val: 'L1–L5', label: 'Segments' }, { val: '80%', label: 'Athletes Affected' }],
    anatomy: [
      { icon: Bone, name: 'L1–L5 Vertebrae', desc: 'Largest vertebrae in the spine' },
      { icon: LinkIcon, name: 'Intervertebral Discs', desc: 'Absorb compressive loads between vertebrae' },
      { icon: Dumbbell, name: 'Erector Spinae', desc: 'Muscle group that extends and stabilises the spine' },
    ],
    injuries: [
      { name: 'Lumbar Disc Herniation', desc: 'Disc nucleus protrudes and compresses nerve roots, causing sciatica.' },
      { name: 'Muscle Strain', desc: 'Overstretching of paraspinal muscles, most common acute low back injury.' },
      { name: 'Spondylolysis', desc: 'Stress fracture of the pars interarticularis, common in young gymnasts and fast bowlers.' },
    ],
    fixes: [
      '<strong>McKenzie Press-Ups</strong> — Prone lumbar extension exercise to centralise disc symptoms.',
      '<strong>Core Activation</strong> — Dead-bug and bird-dog exercises to build deep stabiliser endurance.',
      '<strong>Hip Flexor Stretching</strong> — Psoas lunge stretch to reduce anterior pelvic tilt and lumbar load.',
      '<strong>Heat Therapy</strong> — 15–20 min heat application after 48 h to improve blood flow and reduce spasm.',
      '<strong>Gradual Return to Load</strong> — Progressive strength programme under physio guidance; avoid heavy deadlifts for 6–8 weeks.',
    ],
  },
  knee: {
    name: 'Knee', tag: 'Tibiofemoral Joint',
    desc: 'The knee is the largest joint in the body and the most frequently injured in sport. It must balance stability under heavy load with the mobility needed for running, cutting, and jumping.',
    stats: [{ val: '135°', label: 'Flexion Range' }, { val: '4', label: 'Main Ligaments' }, { val: '#1', label: 'Most Injured Joint in Sport' }],
    anatomy: [
      { icon: Bone, name: 'Femur / Tibia / Patella', desc: 'Three bones forming the knee complex' },
      { icon: LinkIcon, name: 'ACL & PCL', desc: 'Cruciate ligaments preventing fore-aft translation' },
      { icon: LinkIcon, name: 'Menisci', desc: 'C-shaped cartilage discs distributing load across the joint' },
    ],
    injuries: [
      { name: 'ACL Tear', desc: 'Anterior cruciate ligament rupture from pivoting or landing; often requires surgery.' },
      { name: 'Meniscus Tear', desc: 'Torn cartilage from twisting under load; causes locking, swelling and pain.' },
      { name: 'Patellar Tendinopathy', desc: "\"Jumper's knee\" — tendon degeneration from repetitive jumping." },
    ],
    fixes: [
      '<strong>Quad Setting & SLR</strong> — Isometric quad contractions immediately post-injury to prevent atrophy.',
      '<strong>RICE + Compression</strong> — Reduce acute swelling; elevate above heart level for first 48 h.',
      '<strong>Hamstring & Quad Strengthening</strong> — Nordic curls and single-leg press for dynamic joint stability.',
      '<strong>Neuromuscular Training</strong> — Balance board, single-leg hop progressions to retrain landing mechanics.',
      '<strong>ACL Reconstruction</strong> — Surgical graft (patellar or hamstring tendon) followed by 9–12 month rehab for full ruptures.',
    ],
  },
  ankle: {
    name: 'Ankle', tag: 'Talocrural Joint',
    desc: 'The ankle transmits the entire body weight to the foot during every step and jump. Lateral ankle sprains are the single most common sports injury worldwide.',
    stats: [{ val: '26', label: 'Foot + Ankle Bones' }, { val: '3', label: 'Main Ligaments' }, { val: '45%', label: 'of All Sports Injuries' }],
    anatomy: [
      { icon: Bone, name: 'Tibia / Fibula / Talus', desc: 'Bones forming the talocrural joint' },
      { icon: LinkIcon, name: 'ATFL / CFL / PTFL', desc: 'Lateral ligament complex, most commonly sprained' },
      { icon: Dumbbell, name: 'Peroneal Muscles', desc: 'Evertors that protect against inversion sprains' },
    ],
    injuries: [
      { name: 'Lateral Ankle Sprain', desc: 'ATFL stretch or tear from inversion/plantarflexion; Grades I–III.' },
      { name: 'Achilles Tendon Rupture', desc: 'Complete tendon tear, often with an audible pop during push-off.' },
      { name: 'Stress Fracture', desc: 'Repetitive loading causes microfractures in the fibula or fifth metatarsal.' },
    ],
    fixes: [
      '<strong>POLICE Protocol</strong> — Protect, Optimal Loading, Ice, Compression, Elevation for first 72 h.',
      '<strong>Peroneal Strengthening</strong> — Resistance band eversion 3×20 reps to prevent re-sprain.',
      '<strong>Proprioception Training</strong> — Single-leg balance progressions on flat → foam → wobble board.',
      '<strong>Calf Raises (Eccentric)</strong> — Heel drops off a step for Achilles tendinopathy; 3×15 daily for 12 weeks.',
      '<strong>Bracing & Taping</strong> — Lace-up ankle brace or prophylactic taping for return-to-sport protection.',
    ],
  },
};

export default function JointPage() {
  const { jointId } = useParams();
  const [searchParams] = useSearchParams();
  const heroRef = useRef(null);

  // Support both /joint/knee and /joint?joint=knee
  const key = jointId || searchParams.get('joint') || 'nape';
  const d = DATA[key] || DATA.nape;

  useEffect(() => {
    document.title = d.name + ' Joint Guide — Sport Surge Pro';
    window.scrollTo(0, 0);

    // Entrance animation
    const hero = heroRef.current;
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        hero.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      });
    }
  }, [d.name]);

  const nameHtml = d.name.includes(' ')
    ? d.name.replace(/ (\S+)$/, ' <span class="text-[--accent]">$1</span>')
    : d.name + ' <span class="text-[--accent]">Guide</span>';

  return (
    <div className="bg-[#050505] min-h-screen">
      <Link to="/" className="joint-back">Back to Home</Link>

      <div className="joint-hero" ref={heroRef}>
        <div className="joint-tag w-fit">{d.tag}</div>
        <h1
          className="font-[var(--font-display)] text-[clamp(3rem,7vw,6rem)] font-black tracking-tighter leading-none mb-2 text-white"
          dangerouslySetInnerHTML={{ __html: nameHtml }}
        />
        <p className="text-[--text-secondary] text-base mb-10 max-w-[550px] leading-[1.7]">{d.desc}</p>
        <div className="flex gap-10 flex-wrap">
          {d.stats.map((s) => (
            <div key={s.label}>
              <h3 className="font-[var(--font-display)] text-[2rem] font-black text-[--accent] leading-none">{s.val}</h3>
              <p className="text-[0.75rem] text-[--text-muted] uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-[8%] pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="jcard">
          <div className="mb-5 flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-3">
            <Bone size={24} color="var(--accent)" />
            <h2 className="font-[var(--font-display)] text-[1.3rem] font-bold text-white tracking-tight m-0">Anatomy Overview</h2>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-2 gap-4">
            {d.anatomy.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.name} className="anatomy-item flex flex-col items-center">
                  <div className="mb-3 w-10 h-10 rounded-full bg-[rgba(255,107,0,0.1)] flex items-center justify-center">
                    <Icon size={18} color="var(--accent)" />
                  </div>
                  <h4 className="text-[0.8rem] font-semibold text-white mb-0.5">{a.name}</h4>
                  <p className="text-[0.72rem] text-[--text-muted] leading-snug">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="jcard">
          <div className="mb-5 flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-3">
            <AlertTriangle size={24} color="#ffaa00" />
            <h2 className="font-[var(--font-display)] text-[1.3rem] font-bold text-white tracking-tight m-0">Common Injuries</h2>
          </div>
          <ul className="injury-list">
            {d.injuries.map((inj, i) => (
              <li key={inj.name} className="injury-item">
                <div className="injury-num">{i + 1}</div>
                <div>
                  <h4 className="text-[0.875rem] font-semibold text-white mb-1">{inj.name}</h4>
                  <p className="text-[0.8rem] text-[--text-muted] leading-relaxed">{inj.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="jcard md:col-span-2">
          <div className="mb-5 flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-3">
            <HeartPulse size={24} color="#00c864" />
            <h2 className="font-[var(--font-display)] text-[1.3rem] font-bold text-white tracking-tight m-0">Fixes &amp; Recovery</h2>
          </div>
          <ul className="fix-list grid grid-cols-1 md:grid-cols-2 gap-4">
            {d.fixes.map((f, i) => (
              <li key={i} className="fix-item">
                <div className="fix-check">
                  <Check size={14} strokeWidth={3} />
                </div>
                <p className="text-[0.82rem] text-[--text-secondary] leading-relaxed [&_strong]:text-white" dangerouslySetInnerHTML={{ __html: f }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
