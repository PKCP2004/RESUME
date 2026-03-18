/* ================================================================
   PUSHPAKBOT 2.0 — Smart Portfolio Assistant
   - Reads live data from the website DOM
   - Under-construction notice with contact CTA
   - Chip-based UI, animated typing, smooth UX
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ── ELEMENTS ── */
  const toggleBtn   = document.getElementById("chatbot-toggle");
  const chatBox     = document.getElementById("chatbot");
  const closeBtn    = document.getElementById("chat-close");
  const themeToggle = document.getElementById("theme-toggle");
  const chatBody    = document.getElementById("chat-body");
  const chatInput   = document.getElementById("chat-input");
  const chatSend    = document.getElementById("chat-send");
  const pingSound   = document.getElementById("ping");

  if (!toggleBtn || !chatBox || !chatBody) return;

  /* ── STATE ── */
  let lastTopic      = null;
  let openedOnce     = false;
  const cache        = {};

  /* ================================================================
     KNOWLEDGE BASE — reads live from your website DOM
  ================================================================ */
  const KB = {
    education: {
      emoji: "🎓",
      label: "Education",
      keywords: ["education","degree","college","university","school","icai","bcom","b.com",
                 "ca foundation","ca inter","ca intermediate","class x","class xii","cbse","icse","christ"],
      fetch() {
        const col = document.querySelector(".res-col");
        return col ? col.innerText.trim() : null;
      },
      summary: `Pushpak's academic journey:\n\n• **CA Intermediate** — ICAI (Sep 2025). Exemption in Costing.\n• **B.Com (Finance & Accountancy)** — Christ University, Bengaluru. CGPA 3.2, Merit Holder.\n• **CA Foundation** — ICAI (Nov 2022). Scored 210/400, first attempt.\n• **Class XII CBSE** (2022) — 85%, scored 90+ in Accountancy.\n• **Class X ICSE** (2020) — 91.7%, Top 10 in school.`
    },
    experience: {
      emoji: "💼",
      label: "Experience",
      keywords: ["experience","work","job","internship","articleship","rbi","bdo","accenture",
                 "iit roorkee","campus ambassador","career","reserve bank","freelance"],
      fetch() {
        const cols = document.querySelectorAll(".res-col");
        return cols[1] ? cols[1].innerText.trim() : null;
      },
      summary: `Pushpak's professional experience:\n\n• **BDO Articleship** — Indirect Tax (Dec 2025–Present). GST compliance, GSTR filings, ITC reconciliation, e-invoicing, SCN/DRC.\n• **Finance Intern @ RBI** — Bengaluru (Jun–Nov 2024). Macroeconomic analysis, Basel III, repo rates. **Top Performer** 🏅\n• **Campus Ambassador** — E-Summit, IIT Roorkee (Apr–Jul 2023). Grew participation by 20%.\n• **Student Intern @ Accenture** — Kolkata (Jan–Mar 2022). Finance, business analysis, reporting.\n• **Freelance Blog Writer** — Finance & tech content (Oct 2024–Present).`
    },
    skills: {
      emoji: "🛠️",
      label: "Skills",
      keywords: ["skill","tools","power bi","excel","python","tally","figma","html","css",
                 "gst portal","competenc","technical","software","proficiency"],
      fetch() {
        const sc = document.querySelector(".skills-card");
        return sc ? sc.innerText.trim() : null;
      },
      summary: `Pushpak's core skills:\n\n• **Financial Analysis & Reporting** — 92%\n• **GST & Tax Compliance** — 88%\n• **Fintech Web Development** — 85%\n• **Financial Dashboard & UI Design** — 80%\n• **Power BI & Data Visualisation** — 79%\n\n🔧 Tools: Excel · Power BI · HTML/CSS · Python · GST Portal · Tally · Figma`
    },
    awards: {
      emoji: "🏆",
      label: "Awards",
      keywords: ["award","achievement","recognition","honour","honor","harvard","hcap",
                 "top performer","social service","co-editor","magnate","icsfa","eye delineation"],
      fetch() {
        const ab = document.querySelector(".awards-block");
        return ab ? ab.innerText.trim() : null;
      },
      summary: `Pushpak's recognitions:\n\n🏅 **Top Performer** — RBI Research Internship (2024)\n🎓 **HCAP Selection** — Harvard College in Asia Program (2024)\n🌟 **Outstanding Achievement** — ICSFA, Christ University (2024)\n✍️ **Best Co-editor** — Magnate Magazine, Christ University (2024)\n❤️ **Excellence in Social Service** — Global Cancer Concern India (2024)\n🔭 **Finalist** — Eye Delineation Competition, Quantum (2021)`
    },
    services: {
      emoji: "⚡",
      label: "Services",
      keywords: ["service","offer","help","fintech","dashboard","branding","automation",
                 "content","what do you do","what can you do","provide","consulting"],
      fetch() {
        const sec = document.getElementById("services");
        return sec ? sec.innerText.trim() : null;
      },
      summary: `Pushpak offers 5 services:\n\n⚡ **Fintech Web Solutions** — Modern responsive websites for finance professionals.\n📊 **Financial Dashboard & UI Design** — Turning data into visual stories.\n🔄 **Digital Transformation & Automation** — Streamlining accounting workflows.\n🏷️ **Finance Branding & Strategy** — Building trust-driven finance brands.\n🎬 **Financial Education & Content** — Engaging finance content & videos.`
    },
    about: {
      emoji: "👤",
      label: "About",
      keywords: ["about","who is","who are","introduce","background","nationality",
                 "language","bengaluru","india","pushpak","profile","age","personal"],
      fetch() {
        const sec = document.getElementById("about");
        return sec ? sec.innerText.trim() : null;
      },
      summary: `**Pushpak Kumar Charan Pahari** 👤\n\n📍 Bengaluru, India\n🎓 CA Finalist · B.Com (Finance & Accountancy)\n💼 Currently: BDO Articleship (Indirect Tax)\n🌐 Finance Technologist — blending numbers, code & design\n🗣️ Languages: English, Hindi, German\n✅ Available for freelance & collaborations`
    },
    contact: {
      emoji: "📬",
      label: "Contact",
      keywords: ["contact","reach","email","phone","hire","connect","location",
                 "available","whatsapp","message","call","meet"],
      fetch() { return null; },
      summary: `Let's connect! 🤝\n\n📞 **Phone/WhatsApp:** +91 8709923927\n✉️ **Email:** pushpak.pkcp.kumar22@gmail.com\n📍 **Location:** Bengaluru, India\n🔗 **LinkedIn:** [linkedin.com/in/pkcp22](https://www.linkedin.com/in/pkcp22/)\n\n⏰ Available Monday–Saturday · 9AM–7PM`
    },
    resources: {
      emoji: "📦",
      label: "Resources",
      keywords: ["resource","template","excel template","financial model",
                 "download","hra","gst calculator","calculator","free","tool"],
      fetch() { return null; },
      summary: `Free resources by Pushpak 📦\n\n📊 **Excel Templates** — Budgeting, financial analysis, data tracking\n📈 **Financial Models** — Projections, valuation, scenario analysis\n🏠 **HRA Calculator** — Free online tool\n💰 **GST Calculator** — Free online tool\n🧾 Invoice Generator *(Coming soon)*\n\nAll available in the Resources section ↑`
    }
  };

  /* ================================================================
     UNDER CONSTRUCTION NOTICE
  ================================================================ */
  const UNDER_CONSTRUCTION_MSG =
    `⚠️ **Website Notice**\n\nThis portfolio is currently being optimised for full mobile & real-time responsiveness.\n\nSome features may not display perfectly on all devices yet.\n\n📬 **In the meantime, connect directly:**\n✉️ pushpak.pkcp.kumar22@gmail.com\n🔗 [LinkedIn — pkcp22](https://www.linkedin.com/in/pkcp22/)\n\nPushpak is happy to connect! 😊`;

  /* ================================================================
     OPEN / CLOSE
  ================================================================ */
  toggleBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
    toggleBtn.style.display = "none";
    if (!openedOnce) { openedOnce = true; welcome(); }
  });

  closeBtn.addEventListener("click", () => {
    chatBox.style.display = "none";
    toggleBtn.style.display = "flex";
  });

  /* ================================================================
     THEME TOGGLE
  ================================================================ */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("cb-dark");
      themeToggle.textContent = document.body.classList.contains("cb-dark") ? "☀️" : "🌙";
    });
  }

  /* ================================================================
     CORE UI HELPERS
  ================================================================ */
  function addMsg(html, type) {
    /* type: 'bot' | 'user' | 'typing' */
    const d = document.createElement("div");
    d.className = type === "user" ? "cb-msg cb-user" : "cb-msg cb-bot";
    if (type === "typing") {
      d.className = "cb-msg cb-bot cb-typing";
      d.innerHTML = `<span></span><span></span><span></span>`;
      d.id = "cb-typing";
    } else {
      d.innerHTML = type === "user" ? escHtml(html) : mdToHtml(html);
    }
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (type === "bot" && pingSound) { pingSound.currentTime = 0; pingSound.play().catch(() => {}); }
    return d;
  }

  function removeTyping() {
    const t = document.getElementById("cb-typing");
    if (t) t.remove();
  }

  function escHtml(t) {
    return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function mdToHtml(t) {
    return String(t)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, "<br>");
  }

  /* ── Chip row ── */
  function chips(items, onPick) {
    const wrap = document.createElement("div");
    wrap.className = "cb-chips";
    items.forEach(({ label, value }) => {
      const b = document.createElement("button");
      b.className = "cb-chip";
      b.textContent = label;
      b.addEventListener("click", () => {
        addMsg(label, "user");
        wrap.remove();
        onPick(value || label);
      });
      wrap.appendChild(b);
    });
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  /* ── Bot replies with optional delay ── */
  function botSay(text, delay = 700) {
    addMsg("", "typing");
    return new Promise(res => {
      setTimeout(() => {
        removeTyping();
        addMsg(text, "bot");
        res();
      }, delay);
    });
  }

  /* ================================================================
     WELCOME
  ================================================================ */
  async function welcome() {
      await botSay(`Hey there 👋 I'm **PushpakBot**.\nI know everything about this portfolio — ask me anything!\n\n⚠️ **Note:** This website is currently under construction and not fully optimised for all screen sizes yet.\n\n📬 For real-time queries, connect directly:\n✉️ pushpak.pkcp.kumar22@gmail.com\n🔗 [LinkedIn — pkcp22](https://www.linkedin.com/in/pkcp22/)`, 600);    chips([
      { label: "🎓 Education",  value: "education"  },
      { label: "💼 Experience", value: "experience" },
      { label: "🛠️ Skills",     value: "skills"     },
      { label: "⚡ Services",   value: "services"   },
      { label: "🏆 Awards",     value: "awards"     },
      { label: "📬 Contact",    value: "contact"    },
    ], handleInput);
  }

  /* ================================================================
     TOPIC HANDLER
  ================================================================ */
  async function showTopic(key) {
    const topic = KB[key];
    if (!topic) return;
    lastTopic = key;

    /* Try live DOM fetch first, fallback to static summary */
    let live = topic.fetch ? topic.fetch() : null;
    let content = topic.summary;

    if (live && live.length > 80) {
      cache[key] = live;
    }

    await botSay(`${topic.emoji} **${topic.label}**\n\n${content}`, 700);

    chips([
      { label: "🔍 More details",    value: "more_details"   },
      { label: "⭐ Key highlights",  value: "highlights"     },
      { label: "📬 Contact Pushpak", value: "contact"        },
      { label: "🏠 Main menu",       value: "menu"           },
    ], handleInput);
  }

  /* ================================================================
     DEEP DIVE & HIGHLIGHTS
  ================================================================ */
  async function showDetails() {
    if (!lastTopic) {
      await botSay("Please choose a section first 😊"); followUpChips(); return;
    }
    const raw = cache[lastTopic] || KB[lastTopic]?.summary || "";
    const bullets = raw.split(/[\n\.]/)
      .map(l => l.replace(/[•✔️🎓💼🛠️⚡🏆📬📦👤]/g,"").trim())
      .filter(l => l.length > 30)
      .slice(0, 6)
      .map(l => "• " + l)
      .join("\n");
    await botSay(`📌 **Deep dive — ${lastTopic.toUpperCase()}**\n\n${bullets || "No additional details available."}`, 600);
    followUpChips();
  }

  async function showHighlights() {
    if (!lastTopic) {
      await botSay("Please open a section first 🙂"); followUpChips(); return;
    }
    const raw = cache[lastTopic] || KB[lastTopic]?.summary || "";
    const lines = raw.split(/[\n\.]/)
      .map(l => l.replace(/[•\*]/g,"").trim())
      .filter(l => l.length > 35)
      .slice(0, 4)
      .map(l => "✔️ " + l)
      .join("\n");
    await botSay(`⭐ **Key Highlights — ${lastTopic}**\n\n${lines || "No highlights found."}`, 600);
    followUpChips();
  }

  function followUpChips() {
    chips([
      { label: "🔍 More details",    value: "more_details"   },
      { label: "🏠 Main menu",       value: "menu"           },
      { label: "📬 Contact Pushpak", value: "contact"        },
    ], handleInput);
  }

  /* ================================================================
     MAIN INPUT HANDLER
  ================================================================ */
  async function handleInput(raw) {
    const msg = raw.toLowerCase().trim();

    /* ── Special commands ── */
    if (msg === "menu" || msg === "main menu") { welcome(); return; }
    if (msg === "more_details" || msg.includes("more detail") || msg.includes("explore")) { showDetails(); return; }
    if (msg === "highlights"   || msg.includes("highlight"))                               { showHighlights(); return; }

    /* ── Under construction / responsive / mobile ── */
    if (msg.includes("construction") || msg.includes("responsive") ||
        msg.includes("mobile") || msg.includes("not working") ||
        msg.includes("broken") || msg.includes("loading") || msg.includes("issue")) {
      await botSay(UNDER_CONSTRUCTION_MSG, 600);
      chips([
        { label: "✉️ Email Pushpak",   value: "mailto:pushpak.pkcp.kumar22@gmail.com" },
        { label: "🔗 LinkedIn",         value: "linkedin"  },
        { label: "🏠 Main menu",        value: "menu"      },
      ], async (v) => {
        if (v.startsWith("mailto:")) { window.open(v); return; }
        handleInput(v);
      });
      return;
    }

    /* ── Greetings ── */
    if (/^(hi|hello|hey|hii|helo|sup|namaste|yo)\b/.test(msg)) {
      await botSay(`Hey! 👋 Welcome to Pushpak's portfolio.\nI'm PushpakBot — ask me anything about his education, skills, experience or services!`, 500);
      chips([
        { label: "🎓 Education",  value: "education"  },
        { label: "💼 Experience", value: "experience" },
        { label: "🛠️ Skills",     value: "skills"     },
        { label: "📬 Contact",    value: "contact"    },
      ], handleInput);
      return;
    }

    /* ── Who made you ── */
    if (msg.includes("who made") || msg.includes("who built") || msg.includes("creator") || msg.includes("who created")) {
      await botSay(`I was built by **Pushpak Kumar** ✨ — a CA Finalist who codes, designs, and loves finance. Pretty rare combo, right? 😄`, 600);
      followUpChips(); return;
    }

    /* ── Resume / CV ── */
    if (msg.includes("resume") || msg.includes("cv") || msg.includes("download")) {
      await botSay(`📄 Pushpak's CV is available to download!\n\nClick the **"Download CV"** gold button in the hero section, or find it in the sidebar. It's a full-detail resume covering education, experience, and skills.`, 600);
      followUpChips(); return;
    }

    /* ── LinkedIn ── */
    if (msg.includes("linkedin")) {
      await botSay(`🔗 Connect with Pushpak on LinkedIn:\n**[linkedin.com/in/pkcp22](https://www.linkedin.com/in/pkcp22/)**\n\nHe's active and open to connections, collaborations and opportunities!`, 600);
      followUpChips(); return;
    }

    /* ── Email ── */
    if (msg.includes("email") || msg.includes("mail")) {
      await botSay(`✉️ Email Pushpak directly:\n**pushpak.pkcp.kumar22@gmail.com**\n\nOr use the Contact form at the bottom of this page.`, 600);
      followUpChips(); return;
    }

    /* ── CA / Finance questions ── */
    if (msg.includes("ca final") || msg.includes("chartered accountant") || msg.includes("ca exam")) {
      await botSay(`📚 Pushpak is a **CA Finalist** with ICAI.\n\nHe has already cleared **CA Foundation** (2022) and **CA Intermediate** (Sep 2025, with Costing exemption).\n\nHe's pursuing articleship at **BDO** in Indirect Tax while preparing for CA Final.`, 700);
      followUpChips(); return;
    }

    /* ── RBI / internship ── */
    if (msg.includes("rbi") || msg.includes("reserve bank")) {
      await botSay(`🏦 Pushpak interned at the **Reserve Bank of India**, Bengaluru (Jun–Nov 2024).\n\nHe conducted macroeconomic analysis, monitored Basel III norms, tracked repo rate changes, and was awarded **Top Performer** 🏅 by the RBI research team.`, 700);
      followUpChips(); return;
    }

    /* ── Topic keyword matching ── */
    for (const [key, topic] of Object.entries(KB)) {
      if (topic.keywords.some(w => msg.includes(w))) {
        await showTopic(key); return;
      }
    }

    /* ── Contact nudge ── */
    if (msg.includes("hire") || msg.includes("work together") || msg.includes("collaborate") || msg.includes("freelance")) {
      await botSay(`Great! Pushpak is **available for freelance & collaborations** 🤝\n\n📬 **Reach out directly:**\n✉️ pushpak.pkcp.kumar22@gmail.com\n🔗 [LinkedIn — pkcp22](https://www.linkedin.com/in/pkcp22/)\n📞 +91 8709923927`, 600);
      chips([
        { label: "✉️ Send Email",   value: "email"    },
        { label: "🔗 LinkedIn",     value: "linkedin" },
        { label: "🏠 Main menu",    value: "menu"     },
      ], handleInput);
      return;
    }

    /* ── Fallback ── */
    await botSay(`Hmm, I didn't quite catch that 🤔\n\nTry asking about:\n🎓 Education · 💼 Experience · 🛠️ Skills\n⚡ Services · 🏆 Awards · 📬 Contact`, 500);
    chips([
      { label: "🎓 Education",  value: "education"  },
      { label: "💼 Experience", value: "experience" },
      { label: "📬 Contact",    value: "contact"    },
      { label: "🏠 Main menu",  value: "menu"       },
    ], handleInput);
  }

  /* ================================================================
     SEND BUTTON & ENTER KEY
  ================================================================ */
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMsg(text, "user");
    chatInput.value = "";
    handleInput(text);
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

});
