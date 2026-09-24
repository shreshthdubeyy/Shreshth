/* ==========================================================================
   SD.ANALYST - Portfolio Interactive Script
   Handles theme switching, scroll progress animation, interactive project modals,
   and AJAX form submissions.
   ========================================================================== */

// Prevent layout scroll jump on page refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS Animations safely
  if (typeof AOS !== 'undefined') {
    document.body.classList.add('aos-initialized');
    AOS.init({ duration: 800, once: true, offset: 50 });
  }

  // 2. Theme Toggle Controller
  const themeBtn = document.getElementById('theme-btn');
  const body = document.body;

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    const iconClass = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    themeBtn.innerHTML = `
      <span class="toggle-pill" aria-label="Toggle theme">
        <i class="fas ${iconClass}"></i>
      </span>
    `;
  }

  const savedTheme = localStorage.getItem('sd_portfolio_theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('sd_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  // 3. Throttled Scroll Listener (Progress Bar)
  const progressBar = document.getElementById('scroll-progress');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (progressBar && totalHeight > 0) {
          progressBar.style.width = `${(scrollTop / totalHeight) * 100}%`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // 4. Interactive Case Studies Modal Data & Controller
  const caseStudies = {
    'cms-saas': {
      category: 'Digital Transformation',
      title: 'CMS SaaS Cloud Migration',
      challenge: 'Legacy on-premise Cargo Management Systems (CMS) were plagued by latency during peak terminal processing hours, restricted API scalability, and high infrastructure maintenance overhead across international airport terminals.',
      solution: 'Architected and executed a phased migration to a cloud-native microservices SaaS platform. Configured real-time data reporting connectors, integrated EDI messaging pipelines (C-IMP & C-XML), and standardized UAT procedures for rapid terminal onboarding.',
      impact: [
        '30% increase in peak cargo processing efficiency across terminal workflows.',
        'Real-time SLA tracking reducing terminal dwell times by 18%.',
        '99.9% application uptime with zero data loss during high-volume surges.'
      ],
      stack: ['SaaS Delivery', 'EDI (C-IMP & C-XML)', 'Jira', 'Agile Scrum']
    },
    'airport-auto': {
      category: 'Infrastructure & IoT Integration',
      title: 'Airport Terminal Automation & IoT Sync',
      challenge: 'Manual weight, dimension, and load recording at terminal acceptance counters introduced human error, extended truck turn-around times, and created bottlenecks in cargo manifest reconciliation.',
      solution: 'Led functional requirements gathering and deployment for automated weighbridges, Automated Storage & Retrieval Systems (ASRS), Electric Transfer Vehicles (ETVs), and ULD scale sensor integrations with the core terminal OS.',
      impact: [
        '100% automated real-time sync of weight & volume data directly to carrier ERPs.',
        '45% reduction in cargo acceptance processing bottlenecks.',
        'Zero payload calculation discrepancies on outbound flights.'
      ],
      stack: ['Air Cargo Ops', 'ASRS & ETV Systems', 'Process Mapping', 'System Integration']
    },
    'hris-rollout': {
      category: 'Global Enterprise Compliance',
      title: 'Multi-Region HRIS Enterprise Rollout',
      challenge: 'Fragmented workforce tracking systems across regional cargo hubs led to audit compliance risks, manual payroll reconciliation errors, and inconsistent employee data standards.',
      solution: 'Coordinated cross-functional rollout of an enterprise connected HRIS solution across multiple international hubs. Standardized role-based access control, automated shift compliance monitoring, and led change management sessions.',
      impact: [
        'Standardized workforce compliance across 10+ regional airport stations.',
        'Seamless integration with centralized payroll and attendance audit systems.',
        'Accelerated onboarding timeline for new airport ground staff by 40%.'
      ],
      stack: ['HRIS Rollout', 'Stakeholder Mgmt', 'QMS Audit', 'Change Management']
    },
    'synapse': {
      category: 'Product & Delivery Tooling',
      title: 'Synapse — Jira Delivery Intelligence',
      liveUrl: 'https://shreshthdubeyy.github.io/Synapse/',
      specUrl: 'build.html?spec=synapse',
      challenge: 'Jira tracks tasks, but it doesn\'t surface delivery risk — dependency chains, blocked-issue bottlenecks, and true critical paths require manual detective work across epics and subtasks.',
      solution: 'Built a 3-panel workspace (Epic Navigator, Workspace Inspector, Contextual Intelligence) integrated with an interactive SVG dependency graph that surfaces blockages and critical-path chains, plus a Contextual AI Analysis engine powered by Gemini AI that automatically identifies issue risks, bottlenecks, open delivery questions, and recommended next actions.',
      impact: [
        'Interactive SVG dependency graph with pan/zoom surfaces blocked issues and critical paths at a glance, eliminating manual cross-referencing.',
        'Gemini AI Contextual Analysis diagnoses ticket risks, blockers, and open questions directly inside the workspace inspector.',
        'iOS-16-inspired frosted-glass UI with spring-physics interactions and DOMPurify-sanitized AI output — visual craft paired with real XSS hardening.',
        'Zero-dependency SVG architecture delivers instant render performance for complex Epic hierarchies without third-party graph bloat.'
      ],
      stack: ['Vanilla JS', 'SVG Canvas', 'Google Apps Script', 'Gemini AI']
    },
    'crewtask': {
      category: 'Domain-Native Systems',
      title: 'CrewTask — Air Cargo Warehouse Operations & WDO ERP',
      liveUrl: 'https://shreshthdubeyy.site.je/CrewTask',
      specUrl: 'build.html?spec=crewtask',
      challenge: 'Air cargo terminals coordinate multi-shift handovers, physical cargo location, customs clearance status, and strict chain-of-custody — historically over phone calls and shared spreadsheets, with no single source of truth or audit trail.',
      solution: 'Designed a full PHP/MySQL operations workbench that models the real cargo lifecycle end to end — Intake & Allocation → Bay Retrieval → Customs Examination → Gate Dispatch → Delivered — with shift-aware KPIs (three shift windows, auto-detected), bulk status updates, and automatic carry-forward reconciliation for cargo crossing shift boundaries. Shipped alongside a touch-optimized PWA for warehouse-floor tablets and a self-service portal for external Customs House Agents, all governed by three-tier role-based access control.',
      impact: [
        '12-table relational schema with a fully immutable audit trail — every status change, reassignment, and admin action is permanently logged.',
        'Enterprise security hardening: CSRF tokens on every mutating request, bcrypt password hashing, 100% parameterized SQL, and instant session revocation via session versioning.',
        'Dedicated Customs House Agent portal removes an entire category of "what\'s the status?" phone calls.',
        'End-of-Day summary cards and digital shift-handover notes formalize a process that used to live in someone\'s head.'
      ],
      stack: ['PHP', 'MySQL', 'Vanilla JS', 'PWA', 'RBAC']
    },
    'awb-mod7': {
      category: 'Domain-Native Systems',
      title: 'AWB Mod-7 Tool',
      liveUrl: 'https://shreshthdubeyy.github.io/AWB/',
      specUrl: 'build.html?spec=awb-mod7',
      challenge: 'Testing, QA, and daily data entry across cargo systems (CargoWise, iCargo, Cargospot, SAP TM) constantly need valid AWB numbers — normally requiring a spreadsheet or manual modulo arithmetic.',
      solution: 'A zero-dependency, fully offline Chrome/Firefox extension (Manifest V3) that generates valid AWB numbers on demand, batch-generates sequences, and instantly verifies whether an existing number\'s check digit is correct.',
      impact: [
        'Ships with a genuine design-rationale write-up explaining why air cargo standardized on Mod-7 instead of the more rigorous Luhn/Mod-10 algorithm banking uses — and why global switching costs keep it entrenched.',
        'Requires zero browser permissions and collects no data — validated entirely client-side.',
        'Cross-browser (Chrome, Brave, Edge, Firefox) from one shared codebase.'
      ],
      stack: ['JavaScript', 'WebExtensions API', 'Manifest V3']
    },
    'censusconnect': {
      category: 'Range & Craft',
      title: 'CensusConnect — Field Demographic Registry',
      liveUrl: 'https://shreshthdubeyy.github.io/CensusConnect/',
      specUrl: 'build.html?spec=censusconnect',
      challenge: 'Municipal and welfare-program field surveys need structured, multi-tier data capture — building → household → demographics → livelihood → amenities — that still works with poor or no connectivity, and that non-technical enumerators can use in their own language.',
      solution: 'Built an installable, offline-resilient PWA with a 4-part survey questionnaire per household, one-click English/Hindi bilingual switching, client-side offline storage, and password-gated serverless sync to a central database registry.',
      impact: [
        'Full 4-section questionnaire model: structure & ownership, demographics, livelihood & welfare-scheme eligibility, and household amenities.',
        'Offline-resilient via service worker — the survey shell keeps working without a connection.',
        'Instant bilingual UI (English / हिन्दी) with no page reload.',
        'Serverless backend (Google Apps Script + Sheets) — zero infrastructure to maintain.'
      ],
      stack: ['PWA', 'Vanilla JS', 'Google Apps Script', 'i18n']
    },
    'fitness-os': {
      category: 'Range & Craft',
      title: 'Fitness OS',
      liveUrl: 'https://fitness-os-rouge.vercel.app/',
      specUrl: 'build.html?spec=fitness-os',
      challenge: 'Most fitness apps either oversimplify the math with generic calorie targets, or require an account and a backend just to store a weight log.',
      solution: 'Built with Next.js/TypeScript, computing resting calories and daily energy burn via the Mifflin-St Jeor formula, protein-preserving macro targets during a deficit, and 7-day rolling-average weight-trend detection to filter out day-to-day water-weight noise — all stored client-side with multi-profile support, so there\'s no server and no account.',
      impact: [
        'Dual-engine AI coach: live via OpenAI when an API key is present, or a fully offline rule-based fallback — the app never breaks without a key.',
        'Built-in OpenGym workout library (Push/Pull/Legs, Upper/Lower, Full Body) with set logging and rest timers.',
        'PIN-lockable multi-profile support for shared households (e.g. partner, guest).',
        '100% client-side storage — zero server cost, zero data leaves the device.'
      ],
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PWA']
    }
  };

  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close');

  function openModal(projectId) {
    const data = caseStudies[projectId];
    if (!data || !modalBackdrop) return;

    document.getElementById('modal-tag').textContent = data.category;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-challenge').textContent = data.challenge;
    document.getElementById('modal-solution').textContent = data.solution;

    // Render Modal Direct Action Links
    const modalLinks = document.getElementById('modal-links');
    if (modalLinks) {
      const links = [];
      if (data.liveUrl) {
        links.push(`<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="modal-action-btn primary"><i class="fas fa-arrow-up-right-from-square"></i> Open Live App</a>`);
      }
      if (data.sourceUrl) {
        links.push(`<a href="${data.sourceUrl}" target="_blank" rel="noopener noreferrer" class="modal-action-btn"><i class="fab fa-github"></i> View Source</a>`);
      } else if (data.specUrl) {
        links.push(`<a href="${data.specUrl}" target="_blank" rel="noopener noreferrer" class="modal-action-btn"><i class="fas fa-file-code"></i> System Spec</a>`);
      }
      if (links.length > 0) {
        modalLinks.innerHTML = links.join('');
        modalLinks.style.display = 'flex';
      } else {
        modalLinks.innerHTML = '';
        modalLinks.style.display = 'none';
      }
    }

    // Render Impact List
    const impactList = document.getElementById('modal-impact');
    impactList.innerHTML = data.impact.map(item => `
      <li><i class="fas fa-check-circle"></i> <span>${item}</span></li>
    `).join('');

    // Render Stack Chips
    const stackContainer = document.getElementById('modal-stack');
    stackContainer.innerHTML = data.stack.map(tech => `
      <span class="chip">${tech}</span>
    `).join('');

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach project card click handlers
  const projectCards = document.querySelectorAll('.project-card[data-project-id]');
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const projectId = card.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // 5. AJAX Formspree Handler
  const form = document.getElementById('fs-form');
  const formContainer = document.getElementById('form-container');
  const successMsg = document.getElementById('success-msg');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (formContainer && successMsg) {
            formContainer.style.display = 'none';
            successMsg.style.display = 'block';
          }
        } else {
          alert('Oops! There was a problem submitting your message. Please try again.');
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        alert('Network connection error. Please check your internet and try again.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
