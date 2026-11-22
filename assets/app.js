/* Nine months, organised — dates and checklists.
 * Every number on this page is arithmetic on a date the user typed.
 * No diagnosis, no medicine, no advice: the page says so and means it. */
(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = 'mama.v1';
  const DAY = 86400000;

  const state = Object.assign({ lmp: '', due: '', docs: {}, qs: [] },
    JSON.parse(localStorage.getItem(KEY) || '{}'));
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  const iso = (d) => d.toISOString().slice(0, 10);
  const parse = (s) => (s ? new Date(s + 'T00:00:00') : null);
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtShort = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  /* ---------- the three anchors, kept in agreement ---------- */
  // Naegele: due = LMP + 280 days. These are dates, not diagnoses.
  const dueFromLmp = (lmp) => addDays(lmp, 280);
  const lmpFromDue = (due) => addDays(due, -280);
  const lmpFromWeek = (week, today) => addDays(today, -(week * 7));

  function currentDue() {
    if (state.due) return parse(state.due);
    if (state.lmp) return dueFromLmp(parse(state.lmp));
    return null;
  }

  /* ---------- what comes next ---------- */
  const VISITS = [
    [6, 'First visit', 'Confirm the pregnancy, blood group, general blood work.'],
    [9, 'Dating scan', 'Usually between 8 and 10 weeks — measures the baby and sets the date.'],
    [12, 'First trimester screening', 'Blood tests plus a nuchal scan, if you are having it.'],
    [16, 'Routine checkup', 'Weight, blood pressure, and any follow-up blood work.'],
    [20, 'Anomaly scan', 'The detailed scan — organs, growth, and the baby\'s position.'],
    [24, 'Glucose test', 'Screening for gestational diabetes, usually 24–28 weeks.'],
    [28, 'Third trimester begins', 'Checkups move to every two to three weeks from here.'],
    [32, 'Growth scan', 'Checks the baby\'s growth and position.'],
    [36, 'Position check', 'Whether the baby has turned head-down; the birth plan starts.'],
    [38, 'Weekly checkups', 'Every week until the birth.'],
    [40, 'Due date', 'A date, not a deadline — most babies arrive on either side of it.'],
  ];

  const DOCS = [
    'Pregnancy confirmed / first scan',
    'Blood group and Rh factor',
    'Complete blood count',
    'Blood sugar (fasting and post)',
    'Thyroid (TSH)',
    'Urine routine',
    'HIV, HBsAg, VDRL screening',
    'Dating scan report',
    'Anomaly scan report',
    'Glucose tolerance test result',
    'All scan images saved',
    'Insurance / scheme papers',
    'Hospital admission papers',
    'Doctor\'s phone number written down',
  ];

  const BAG = [
    ['For you', ['ID and hospital papers', 'Two comfortable nightdresses', 'Sanitary pads (maternity)', 'Toiletries and a towel', 'Slippers', 'Phone charger (long cable)', 'Water bottle', 'Snacks']],
    ['For the baby', ['Cotton wraps / swaddle', 'Two or three sets of clothes', 'Nappies and wipes', 'A cap and socks', 'Muslin cloths', 'Baby blanket']],
    ['Whoever comes with you', ['Their own change of clothes', 'Cash and cards', 'A list of people to call', 'Charge bank and numbers ready']],
  ];

  /* ---------- render: now ---------- */
  function renderNow() {
    const due = currentDue();
    if (!due) {
      $('#wkNow').textContent = '—'; $('#daysLeft').textContent = '—';
      $('#dueOut').textContent = '—'; $('#pct').textContent = '—';
      $('#tri').textContent = '—';
      $('#ringFg').style.strokeDashoffset = 327;
      $('#nextMilestone').textContent = 'Add your dates above and this fills in.';
      return;
    }
    const start = lmpFromDue(due);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const elapsed = Math.floor((now - start) / DAY);
    const week = Math.max(0, Math.min(42, Math.floor(elapsed / 7)));
    const left = Math.max(0, Math.round((due - now) / DAY));
    const pct = Math.max(0, Math.min(100, (elapsed / 280) * 100));

    $('#wkNow').textContent = week;
    $('#daysLeft').textContent = left;
    $('#dueOut').textContent = fmtShort(due);
    $('#pct').textContent = Math.round(pct) + '%';
    $('#ringFg').style.strokeDashoffset = 327 - (327 * pct) / 100;
    $('#tri').textContent = week < 13 ? 'First trimester' : week < 28 ? 'Second trimester' : 'Third trimester';
    $('#wk').value = week || '';

    // pick the first checkpoint still ahead of today, not merely >= the week count:
    // "next" describing something happening today reads as if it already passed
    const next = VISITS.find(([w]) => addDays(start, w * 7) > now);
    if (next) {
      const when = addDays(start, next[0] * 7);
      const days = Math.round((when - now) / DAY);
      const rel = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
      $('#nextMilestone').textContent =
        `Next: ${next[1].toLowerCase()} — around week ${next[0]}, ${rel} (${fmtShort(when)}). ${next[2]}`;
    } else {
      $('#nextMilestone').textContent = 'All the usual checkpoints have passed. Appointments are set by your doctor now.';
    }
  }

  function renderTimeline() {
    const due = currentDue();
    const start = due ? lmpFromDue(due) : null;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const week = start ? Math.floor((now - start) / DAY / 7) : null;

    $('#timeline').innerHTML = VISITS.map(([w, title, desc]) => {
      const date = start ? addDays(start, w * 7) : null;
      const past = week != null && w < week;
      const soon = week != null && w >= week && w < week + 5;
      return `<div class="tl ${past ? 'past' : ''} ${soon ? 'soon' : ''}">
        <span class="w">wk ${w}</span>
        <div><b>${title}</b><p>${desc}</p></div>
        <span class="dt">${date ? fmtShort(date) : '—'}</span>
      </div>`;
    }).join('');
  }

  function renderDocs() {
    const done = DOCS.filter((d) => state.docs[d]).length;
    $('#docCount').textContent = `${done} of ${DOCS.length} done`;
    $('#docs').innerHTML = DOCS.map((d) => `
      <label class="check ${state.docs[d] ? 'on' : ''}">
        <input type="checkbox" data-d="${d.replace(/"/g, '&quot;')}" ${state.docs[d] ? 'checked' : ''}>
        <span>${d}</span>
      </label>`).join('');
    $('#docs').querySelectorAll('input').forEach((el) => {
      el.onchange = () => {
        state.docs[el.dataset.d] = el.checked;
        save(); renderDocs();
      };
    });
  }

  function renderBag() {
    const due = currentDue();
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const left = due ? Math.round((due - now) / DAY) : null;
    // the bag only asks for attention in the last stretch
    const open = left != null && left <= 35;
    $('#bag').innerHTML = BAG.map(([title, items]) => `
      <div class="bagcol ${open ? '' : 'locked'}">
        <h3>${title}</h3>
        <ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>`).join('') +
      (open ? '<p class="locknote">It is near enough to pack.</p>'
            : '<p class="locknote">Waiting until about five weeks before — nobody needs a bag at week 12.</p>');
  }

  function renderQs() {
    $('#qlist').innerHTML = state.qs.length
      ? state.qs.map((q, i) => `<li><span>${q}</span><button data-i="${i}" title="remove">✕</button></li>`).join('')
      : '<li class="empty">Nothing yet. The best questions are the ones you write down the moment they occur to you.</li>';
    $('#qlist').querySelectorAll('button').forEach((b) => b.onclick = () => {
      state.qs.splice(+b.dataset.i, 1); save(); renderQs();
    });
  }

  /* ---------- the three inputs keep each other honest ---------- */
  $('#lmp').value = state.lmp; $('#due').value = state.due;

  $('#lmp').onchange = (e) => {
    state.lmp = e.target.value;
    state.due = state.lmp ? iso(dueFromLmp(parse(state.lmp))) : '';
    $('#due').value = state.due;
    $('#wk').value = '';
    save(); renderAll();
  };
  $('#due').onchange = (e) => {
    state.due = e.target.value;
    state.lmp = state.due ? iso(lmpFromDue(parse(state.due))) : '';
    $('#lmp').value = state.lmp;
    $('#wk').value = '';
    save(); renderAll();
  };
  $('#wk').onchange = (e) => {
    const w = parseInt(e.target.value, 10);
    if (!w || w < 1 || w > 42) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const lmp = lmpFromWeek(w, today);
    state.lmp = iso(lmp);
    state.due = iso(dueFromLmp(lmp));
    $('#lmp').value = state.lmp; $('#due').value = state.due;
    save(); renderAll();
  };

  const savedTheme = localStorage.getItem('mama.theme');
  document.documentElement.dataset.theme = savedTheme || 'day';
  $('#theme').onclick = () => {
    const n = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    document.documentElement.dataset.theme = n;
    localStorage.setItem('mama.theme', n);
  };
  $('#wipe').onclick = () => {
    if (!confirm('Clear everything saved in this browser? This cannot be undone.')) return;
    localStorage.removeItem(KEY);
    location.reload();
  };

  function renderAll() { renderNow(); renderTimeline(); renderDocs(); renderBag(); }

  renderAll(); renderQs();
  document.documentElement.dataset.ready = '1';
})();
