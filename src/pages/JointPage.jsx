import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Bone, Dumbbell, Link as LinkIcon, AlertTriangle, HeartPulse, ArrowLeft, ChevronRight } from 'lucide-react';
import { initJointPageAnim } from '../lib/jointAnimations';

/* ═══════════════════════ DATA ═══════════════════════ */
const DATA = {
  tmj: {
    name: 'TMJ', tag: 'Temporomandibular Joint',
    desc: 'The temporomandibular joint connects the jaw to the skull and is the only bilateral joint in the body that functions as a single unit. Critical for chewing, speaking, and absorbing impact in contact sports.',
    stats: [{ val: '2', label: 'Bilateral Joints' }, { val: '4', label: 'Chewing Muscles' }, { val: '7mm', label: 'Avg. Disc Thickness' }],
    anatomy: [
      { icon: Bone, name: 'Mandibular Condyle', desc: 'The rounded end of the jaw that articulates with the temporal bone' },
      { icon: LinkIcon, name: 'Articular Disc', desc: 'Fibrocartilage disc cushioning the joint during movement' },
      { icon: Dumbbell, name: 'Masseter & Pterygoids', desc: 'Primary muscles driving jaw opening, closing, and lateral movement' },
    ],
    injuries: [
      { name: 'TMJ Disc Displacement', desc: 'Articular disc slips out of position causing clicking, locking, and jaw deviation on opening.' },
      { name: 'Bruxism (Jaw Clenching)', desc: 'Unconscious grinding or clenching under athletic stress, accelerating cartilage wear.' },
      { name: 'Mandibular Fracture', desc: 'Direct trauma to the jaw in contact sports; second most common facial fracture in athletes.' },
    ],
    fixes: [
      { title: 'Soft Diet + Rest', desc: 'Avoid hard/chewy foods for 2–4 weeks to offload the joint acutely.' },
      { title: 'Jaw Mobility Exercises', desc: 'Controlled mouth opening with a tongue-up position to recapture displaced disc.' },
      { title: 'Occlusal Splint', desc: 'Custom night guard reduces bruxism load and allows joint decompression.' },
      { title: 'Physiotherapy', desc: 'Intra-oral massage of pterygoid muscles and joint mobilisation techniques.' },
      { title: 'Mouthguard', desc: 'Fitted gumshield distributes impact forces and prevents disc trauma during competition.' },
    ],
  },
  neck: {
    name: 'Neck', tag: 'Cervical Spine',
    desc: 'The cervical spine is a stack of seven vertebrae connecting the skull to the thorax, protecting the spinal cord while allowing the widest range of head motion in the body. A critical structure for all contact and overhead sports.',
    stats: [{ val: '7', label: 'Vertebrae (C1–C7)' }, { val: '70°', label: 'Rotation Each Way' }, { val: '45°', label: 'Flexion / Extension' }],
    anatomy: [
      { icon: Bone, name: 'C1–C7 Vertebrae', desc: 'Atlas (C1) and Axis (C2) enable head nodding and rotation' },
      { icon: LinkIcon, name: 'Intervertebral Discs', desc: 'Shock-absorbing fibrocartilage pads between each vertebra' },
      { icon: Dumbbell, name: 'Trapezius & SCM', desc: 'Sternocleidomastoid and trapezius stabilise and move the head' },
    ],
    injuries: [
      { name: 'Cervical Strain (Whiplash)', desc: 'Sudden hyperextension-flexion of the neck from impact; causes pain, stiffness, and headaches.' },
      { name: 'Herniated Cervical Disc', desc: 'Disc nucleus protrudes and compresses nerve roots, causing radiating arm pain.' },
      { name: 'Burner / Stinger', desc: 'Traction or compression of the brachial plexus in contact sport; electric-shock sensation down one arm.' },
    ],
    fixes: [
      { title: 'RICE Protocol', desc: 'Rest, Ice 20 min on/off, gentle Compression, and limit loading in the first 72 h.' },
      { title: 'Chin Tucks', desc: '10 reps × 3 sets daily; restores cervical lordosis and retrains deep neck flexors.' },
      { title: 'Isometric Strengthening', desc: 'Resistance in all 4 directions to stabilise the cervical muscles.' },
      { title: 'Manual Therapy', desc: 'Physiotherapist-guided cervical traction for disc-related radiculopathy.' },
      { title: 'Postural Correction', desc: 'Ergonomic screen height, chin-tuck habit, and scapular retraction drills.' },
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
      { title: 'Pendulum Exercises', desc: 'Gravity-assisted shoulder circles to decompress the joint early post-injury.' },
      { title: 'Rotator Cuff Strengthening', desc: 'External rotation with resistance band; 3×15 reps daily.' },
      { title: 'Scapular Stabilisation', desc: 'Wall slides, rows and Y-T-W raises to restore shoulder blade control.' },
      { title: 'Anti-Inflammatory Protocol', desc: 'NSAIDs + ice for the first 72 hours; consult a physician.' },
      { title: 'Return-to-Sport Progression', desc: 'Gradual throwing/overhead program from 8–12 weeks post-injury.' },
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
      { name: 'Tennis Elbow', desc: 'Overuse of forearm extensors causes pain at the outer elbow.' },
      { name: "Golfer's Elbow", desc: 'Inner elbow pain from repetitive wrist flexion and gripping.' },
      { name: 'UCL Tear', desc: 'Medial collateral ligament rupture in overhead throwing athletes.' },
    ],
    fixes: [
      { title: 'Eccentric Wrist Extensions', desc: 'Slowly lower a light weight; 3×15 reps for tendon remodelling.' },
      { title: 'Forearm Stretching', desc: 'Flexor and extensor stretches held 30 s, 3× daily.' },
      { title: 'Grip Strengthening', desc: 'Stress ball or hand gripper; progressive resistance over 6 weeks.' },
      { title: 'PRP Therapy', desc: 'Injection therapy for chronic tendinopathy; 70–80% success rate.' },
      { title: 'Activity Modification', desc: 'Reduce repetitive loading and correct throwing mechanics with a coach.' },
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
      { title: 'Wrist Splinting', desc: 'Neutral-position splint for 4–6 weeks for sprains and mild TFCC tears.' },
      { title: 'Tendon Gliding Exercises', desc: '5-position finger sequence to maintain carpal tunnel mobility.' },
      { title: 'Strengthening', desc: 'Wrist curls and rice bucket exercises for grip rehabilitation.' },
      { title: 'Ultrasound Therapy', desc: 'Therapeutic ultrasound reduces inflammation in tendon sheaths.' },
      { title: 'Surgical Consult', desc: 'Scaphoid non-unions or complete TFCC tears may require arthroscopic repair.' },
    ],
  },
  hip: {
    name: 'Hip', tag: 'Acetabulofemoral Joint',
    desc: 'The hip is the body\'s largest ball-and-socket joint, transmitting forces between the torso and legs. It supports full body weight during every stride, kick, and jump — making it the engine of athletic power.',
    stats: [{ val: '120°', label: 'Flexion Range' }, { val: '250%', label: 'Body Weight Force' }, { val: '3', label: 'Axes of Motion' }],
    anatomy: [
      { icon: Bone, name: 'Femoral Head & Acetabulum', desc: 'Ball-and-socket pairing providing stability and multiaxial movement' },
      { icon: LinkIcon, name: 'Labrum', desc: 'Fibrocartilage ring deepening the socket and sealing synovial fluid' },
      { icon: Dumbbell, name: 'Gluteal Muscles & Hip Flexors', desc: 'Primary movers for running, jumping, and power generation' },
    ],
    injuries: [
      { name: 'Hip Labral Tear', desc: 'Tearing of the fibrocartilage ring from femoroacetabular impingement or pivoting.' },
      { name: 'Hip Flexor Strain', desc: 'Iliopsoas or rectus femoris tear from explosive sprinting or kicking.' },
      { name: 'Greater Trochanteric Bursitis', desc: 'Inflammation of the lateral hip bursa from repetitive abductor loading.' },
    ],
    fixes: [
      { title: 'Hip Flexor Stretching', desc: 'Kneeling lunge stretch held 45 s, 3× daily to reduce anterior impingement.' },
      { title: 'Glute Activation', desc: 'Clamshells, side-lying abduction and single-leg bridges to restore control.' },
      { title: 'Hip Mobility Drills', desc: '90/90 hip stretch and pigeon pose to improve rotation range.' },
      { title: 'Load Management', desc: 'Reduce sprint volume and avoid deep squatting for 4–6 weeks post-injury.' },
      { title: 'Surgical Review', desc: 'Labral tears with impingement may require hip arthroscopy; 6–9 month return.' },
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
      { name: 'Patellar Tendinopathy', desc: '"Jumper\'s knee" — tendon degeneration from repetitive jumping.' },
    ],
    fixes: [
      { title: 'Quad Setting & SLR', desc: 'Isometric quad contractions immediately post-injury to prevent atrophy.' },
      { title: 'RICE + Compression', desc: 'Reduce acute swelling; elevate above heart level for first 48 h.' },
      { title: 'Hamstring & Quad Strengthening', desc: 'Nordic curls and single-leg press for dynamic joint stability.' },
      { title: 'Neuromuscular Training', desc: 'Balance board, single-leg hop progressions to retrain landing mechanics.' },
      { title: 'ACL Reconstruction', desc: 'Surgical graft followed by 9–12 month rehab for full ruptures.' },
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
      { title: 'POLICE Protocol', desc: 'Protect, Optimal Loading, Ice, Compression, Elevation for first 72 h.' },
      { title: 'Peroneal Strengthening', desc: 'Resistance band eversion 3×20 reps to prevent re-sprain.' },
      { title: 'Proprioception Training', desc: 'Single-leg balance progressions on flat → foam → wobble board.' },
      { title: 'Calf Raises (Eccentric)', desc: 'Heel drops off a step for Achilles tendinopathy; 3×15 daily for 12 weeks.' },
      { title: 'Bracing & Taping', desc: 'Lace-up ankle brace or prophylactic taping for return-to-sport protection.' },
    ],
  },
};

const JOINT_NAV = [
  { key: 'tmj', label: 'TMJ' },
  { key: 'neck', label: 'Neck' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'elbow', label: 'Elbow' },
  { key: 'wrist', label: 'Wrist' },
  { key: 'hip', label: 'Hip' },
  { key: 'knee', label: 'Knee' },
  { key: 'ankle', label: 'Ankle' },
];

const WORDMARKS = {
  tmj: 'Jaw',
  neck: 'Neck',
  shoulder: 'Shoulder',
  elbow: 'Elbow',
  wrist: 'Wrist',
  hip: 'Hip',
  knee: 'Knee',
  ankle: 'Ankle',
};

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function JointPage() {
  const { jointId } = useParams();
  const [searchParams] = useSearchParams();
  const pageRef = useRef(null);

  const key = jointId || searchParams.get('joint') || 'tmj';
  const d = DATA[key] || DATA.tmj;
  const wordmark = WORDMARKS[key] || 'Joint';

  useEffect(() => {
    document.title = d.name + ' — Joint Guide | Sport Surge Pro';
    window.scrollTo(0, 0);

    const page = pageRef.current;
    if (page) {
      page.style.opacity = '0';
      requestAnimationFrame(() => {
        page.style.transition = 'opacity 0.4s ease';
        page.style.opacity = '1';
        // Run animations after page fades in
        setTimeout(() => initJointPageAnim(), 80);
      });
    }
  }, [key, d.name]);

  return (
    <div className="jp" ref={pageRef}>
      <div className="jp-grid" aria-hidden="true" />
      <div className="jp-scanline" aria-hidden="true" />
      <div className="jp-wordmark" aria-hidden="true">{wordmark}</div>

      {/* ─── Sticky top bar ─── */}
      <header className="jp-bar">
        <Link to="/" className="jp-bar-back"><ArrowLeft size={15} /> Home</Link>
        <nav className="jp-bar-nav">
          {JOINT_NAV.map((j) => (
            <Link key={j.key} to={`/joint/${j.key}`} className={`jp-bar-link${j.key === key ? ' is-active' : ''}`}>
              {j.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ─── Hero / Overview ─── */}
      <section className="jp-hero">
        <div className="section-label">Joint Breakdown</div>
        <span className="jp-hero-tag">{d.tag}</span>
        <h1 className="jp-hero-title">{d.name}</h1>
        <p className="jp-hero-desc">{d.desc}</p>

        <div className="jp-stats">
          {d.stats.map((s) => (
            <div key={s.label} className="jp-stat">
              <span className="jp-stat-val">{s.val}</span>
              <span className="jp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="jp-divider"></div>

      {/* ─── Anatomy ─── */}
      <section className="jp-sect">
        <h2 className="jp-sect-title"><Bone size={18} /> Anatomy</h2>
        <div className="jp-anatomy-row">
          {d.anatomy.map((a) => {
            const Icon = a.icon;
            return (
              <article key={a.name} className="jp-anat">
                <div className="jp-anat-icon"><Icon size={20} /></div>
                <div>
                  <h4 className="jp-anat-name">{a.name}</h4>
                  <p className="jp-anat-desc">{a.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="jp-divider"></div>

      {/* ─── Common Injuries ─── */}
      <section className="jp-sect">
        <h2 className="jp-sect-title"><AlertTriangle size={18} /> Common Injuries</h2>
        <div className="jp-injuries">
          {d.injuries.map((inj, i) => (
            <article key={inj.name} className="jp-inj">
              <span className="jp-inj-badge">{i + 1}</span>
              <div>
                <h4 className="jp-inj-name">{inj.name}</h4>
                <p className="jp-inj-desc">{inj.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="jp-divider"></div>

      {/* ─── Recovery Protocol ─── */}
      <section className="jp-sect">
        <h2 className="jp-sect-title jp-sect-title--green"><HeartPulse size={18} /> Recovery Protocol</h2>
        <ol className="jp-fixes">
          {d.fixes.map((f, i) => (
            <li key={i} className="jp-fix">
              <div className="jp-fix-head">
                <span className="jp-fix-step">Step {i + 1}</span>
                <h4 className="jp-fix-name">{f.title}</h4>
              </div>
              <p className="jp-fix-desc">{f.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Footer nav ─── */}
      <footer className="jp-foot">
        <span className="jp-foot-label">Other Joints</span>
        <div className="jp-foot-links">
          {JOINT_NAV.filter((j) => j.key !== key).map((j) => (
            <Link key={j.key} to={`/joint/${j.key}`} className="jp-foot-link">
              {j.label} <ChevronRight size={13} />
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
