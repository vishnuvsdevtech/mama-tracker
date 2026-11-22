/* Nine months, organised — and after.
 * All persistence goes through window.Store, so a real backend can replace it
 * without touching this file. Nothing here authors medical advice. */
(() => {
  const $ = (s) => document.querySelector(s);
  const { fmt, fmtShort, parse, addDays, dueFromLmp, lmpFromDue } = window.Summary;
  const DAY = 86400000;

  let record = null;

  /* ---------- profiles ---------- */
  async function drawProfiles() {
    const list = await window.Store.listProfiles();
    $('#profiles').innerHTML = list.length
      ? list.map((p) => `<button class="pchip ${record && p.id === record.id ? 'on' : ''}" data-id="${p.id}">
           ${p.name}${list.length > 1 ? '<span class="x" data-del="' + p.id + '" title="remove">✕</span>' : ''}
         </button>`).join('')
      : '<span class="hint">No profile yet — create one below.</span>';

    $('#profiles').querySelectorAll('.pchip').forEach((b) => b.onclick = async (e) => {
      if (e.target.dataset.del) return;
      window.Store.setActive(b.dataset.id);
      record = await window.Store.load();
      renderAll();
    });
    $('#profiles').querySelectorAll('[data-del]').forEach((x) => x.onclick = async (e) => {
      e.stopPropagation();
      if (!confirm('Remove this profile and everything in it? This cannot be undone.')) return;
      await window.Store.remove(x.dataset.del);
      record = await window.Store.load();
      renderAll();
    });
  }

  $('#newBtn').onclick = async () => {
    const name = $('#newName').value.trim();
    if (!name) return $('#newName').focus();
    record = await window.Store.create(name);
    $('#newName').value = '';
    renderAll();
  };

  /* ---------- summary ---------- */
  function drawSummary() {
    if (!record) { $('#summaryCard').hidden = true; return; }
    const lines = window.Summary.build(record);
    const born = !!record.bornAt && parse(record.bornAt) <= new Date();
    $('#summaryCard').hidden = false;
    $('#sumFor').textContent = born ? 'counting up' : 'counting down';
    $('#sumlist').innerHTML = lines.map((l) => `<li>${esc(l)}</li>`).join('');
    document.documentElement.dataset.phase = born ? 'after' : 'before';
  }

  const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  /* ---------- pregnancy side ---------- */
  const currentDue = () => {
    if (!record) return null;
    if (record.due) return parse(record.due);
    if (record.lmp) return dueFromLmp(parse(record.lmp));
    if (record.bornAt) return parse(record.bornAt);   // the due date, once known
    return null;
  };

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
    'Pregnancy confirmed / first scan', 'Blood group and Rh factor', 'Complete blood count',
    'Blood sugar (fasting and post)', 'Thyroid (TSH)', 'Urine routine',
    'HIV, HBsAg, VDRL screening', 'Dating scan report', 'Anomaly scan report',
    'Glucose tolerance test result', 'All scan images saved', 'Insurance / scheme papers',
    'Hospital admission papers', 'Doctor\'s phone number written down',
  ];

  const BAG = [
    ['For you', ['ID and hospital papers', 'Two comfortable nightdresses', 'Sanitary pads (maternity)', 'Toiletries and a towel', 'Slippers', 'Phone charger (long cable)', 'Water bottle', 'Snacks']],
    ['For the baby', ['Cotton wraps / swaddle', 'Two or three sets of clothes', 'Nappies and wipes', 'A cap and socks', 'Muslin cloths', 'Baby blanket']],
    ['Whoever comes with you', ['Their own change of clothes', 'Cash and cards', 'A list of people to call', 'Charge bank and numbers ready']],
  ];

  function renderNow() {
    const due = currentDue();
    if (!due) {
      ['#wkNow', '#daysLeft', '#dueOut', '#pct'].forEach((s) => $(s).textContent = '—');
      $('#tri').textContent = '—';
      $('#ringFg').style.strokeDashoffset = 327;
      $('#nextMilestone').textContent = 'Add your dates above and this fills in.';
      return;
    }
    const start = lmpFromDue(due);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const born = record.bornAt && parse(record.bornAt);
    const pct = Math.max(0, Math.min(100, ((now - start) / DAY / 280) * 100));
    $('#pct').textContent = Math.round(pct) + '%';
    $('#ringFg').style.strokeDashoffset = 327 - (327 * pct) / 100;

    if (born && born <= now) {
      const a = window.Summary.ageOf(born, now);
      $('#wkNow').textContent = a.days < 14 ? a.days : Math.floor(a.days / 7);
      $('#wkNow').nextElementSibling.textContent = a.days < 14 ? 'days' : 'weeks';
      $('#daysLeft').textContent = a.days;
      $('#dueOut').textContent = fmtShort(born);
      $('#tri').textContent = 'after birth';
      $('#nextMilestone').textContent = `${record.name2 || 'The baby'} is ${a.label}. Born ${fmt(born)}.`;
      return;
    }
    if (born) { $('#wkNow').nextElementSibling.textContent = 'weeks'; }

    const elapsed = Math.floor((now - start) / DAY);
    const week = Math.max(0, Math.min(42, Math.floor(elapsed / 7)));
    const left = Math.max(0, Math.round((due - now) / DAY));
    $('#wkNow').textContent = week;
    $('#wkNow').nextElementSibling.textContent = 'weeks';
    $('#daysLeft').textContent = left;
    $('#dueOut').textContent = fmtShort(due);
    $('#tri').textContent = week < 13 ? 'First trimester' : week < 28 ? 'Second trimester' : 'Third trimester';
    $('#wk').value = week || '';

    const next = VISITS.find(([w]) => addDays(start, w * 7) > now);
    if (next) {
      const when = addDays(start, next[0] * 7);
      const d = Math.round((when - now) / DAY);
      const rel = d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
      $('#nextMilestone').textContent = `Next: ${next[1].toLowerCase()} — around week ${next[0]}, ${rel} (${fmtShort(when)}). ${next[2]}`;
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
        <span class="dt">${date ? fmtShort(date) : '—'}</span></div>`;
    }).join('');
  }

  function renderDocs() {
    if (!record) return;
    const done = DOCS.filter((d) => record.docs[d]).length;
    $('#docCount').textContent = `${done} of ${DOCS.length} done`;
    $('#docs').innerHTML = DOCS.map((d) => `
      <label class="check ${record.docs[d] ? 'on' : ''}">
        <input type="checkbox" data-d="${d.replace(/"/g, '&quot;')}" ${record.docs[d] ? 'checked' : ''}>
        <span>${d}</span></label>`).join('');
    $('#docs').querySelectorAll('input').forEach((el) => {
      el.onchange = async () => {
        record.docs[el.dataset.d] = el.checked;
        await window.Store.save(record);
        renderDocs(); drawSummary();
      };
    });
  }

  function renderBag() {
    const due = currentDue();
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const left = due ? Math.round((due - now) / DAY) : null;
    const open = left != null && left <= 35 && left > 0;
    $('#bag').innerHTML = BAG.map(([t, items]) => `
      <div class="bagcol ${open ? '' : 'locked'}"><h3>${t}</h3>
        <ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('') +
      (open ? '<p class="locknote">It is near enough to pack.</p>'
            : '<p class="locknote">Waiting until about five weeks before — nobody needs a bag at week 12.</p>');
  }

  function renderQs() {
    if (!record) return;
    $('#qlist').innerHTML = record.qs.length
      ? record.qs.map((q, i) => `<li><span>${esc(q)}</span><button data-i="${i}">✕</button></li>`).join('')
      : '<li class="empty">Nothing yet. The best questions are the ones you write down the moment they occur to you.</li>';
    $('#qlist').querySelectorAll('button').forEach((b) => b.onclick = async () => {
      record.qs.splice(+b.dataset.i, 1);
      await window.Store.save(record); renderQs(); drawSummary();
    });
  }

  $('#qadd').onclick = async () => {
    const v = $('#qin').value.trim();
    if (!v || !record) return;
    record.qs.push(v); $('#qin').value = '';
    await window.Store.save(record); renderQs(); drawSummary();
  };
  $('#qin').onkeydown = (e) => { if (e.key === 'Enter') $('#qadd').click(); };

  /* ---------- anchors ---------- */
  function bindAnchors() {
    $('#lmp').onchange = async (e) => {
      if (!record) return;
      record.lmp = e.target.value;
      record.due = record.lmp ? iso(dueFromLmp(parse(record.lmp))) : '';
      $('#due').value = record.due; $('#wk').value = '';
      await window.Store.save(record); renderAll();
    };
    $('#due').onchange = async (e) => {
      if (!record) return;
      record.due = e.target.value;
      record.lmp = record.due ? iso(lmpFromDue(parse(record.due))) : '';
      $('#lmp').value = record.lmp; $('#wk').value = '';
      await window.Store.save(record); renderAll();
    };
    $('#wk').onchange = async (e) => {
      const w = parseInt(e.target.value, 10);
      if (!w || w < 1 || w > 42 || !record) return;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const lmp = addDays(today, -(w * 7));
      record.lmp = iso(lmp); record.due = iso(dueFromLmp(lmp));
      $('#lmp').value = record.lmp; $('#due').value = record.due;
      await window.Store.save(record); renderAll();
    };
  }
  const iso = (d) => d.toISOString().slice(0, 10);

  /* ---------- birth switch ---------- */
  $('#bornBtn').onclick = async () => {
    if (!record) return;
    const d = $('#bornAt').value;
    if (!d) return $('#bornAt').focus();
    record.bornAt = d;
    record.name2 = $('#babyName').value.trim();
    await window.Store.save(record);
    document.documentElement.dataset.phase = 'after';
    renderAll();
  };

  /* ---------- daily log ---------- */
  function renderLog() {
    if (!record) return;
    const born = record.bornAt && parse(record.bornAt) <= new Date();
    $('#logCard').hidden = !born;
    $('#schedCard').hidden = !born;
    $('#birthCard').hidden = born;
    if (!born) return;

    const items = (record.log || []).slice(-40).reverse();
    $('#logCount').textContent = items.length ? `${items.length} entr${items.length === 1 ? 'y' : 'ies'}` : 'nothing yet';
    $('#loglist').innerHTML = items.length ? items.map((l, i) => {
      const t = new Date(l.at);
      return `<div class="logitem"><span><b>${l.kind}</b>${l.note ? ' — ' + esc(l.note) : ''}</span>
        <span class="t">${t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        ${t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span></div>`;
    }).join('') : '<p class="empty">Tap a button to record something. Over a week this becomes the record you look back at.</p>';

    $('#jablist').innerHTML = (record.jabs || []).length ? record.jabs
      .slice().sort((a, b) => a.due.localeCompare(b.due))
      .map((j, i) => {
        const w = parse(j.due), n = new Date(); n.setHours(0, 0, 0, 0);
        const d = Math.round((w - n) / DAY);
        const rel = d < 0 ? `${Math.abs(d)}d ago` : d === 0 ? 'today' : `in ${d}d`;
        return `<div class="logitem"><span><b>${esc(j.name)}</b></span>
          <span class="t">${fmtShort(w)} · ${rel}
          <button data-j="${i}">✕</button></span></div>`;
      }).join('') : '<p class="empty">No dates yet.</p>';
    $('#jablist').querySelectorAll('button').forEach((b) => b.onclick = async () => {
      record.jabs.splice(+b.dataset.j, 1);
      await window.Store.save(record); renderLog(); drawSummary();
    });
  }

  document.querySelectorAll('.lchip').forEach((b) => b.onclick = async () => {
    if (!record) return;
    const kind = b.dataset.k;
    let note = '';
    if (kind === 'note') { note = (prompt('Note for the record?') || '').trim(); if (!note) return; }
    record.log.push({ at: new Date().toISOString(), kind, note });
    await window.Store.save(record);
    renderLog(); drawSummary();
  });

  $('#jabAdd').onclick = async () => {
    if (!record) return;
    const name = $('#jabName').value.trim(), due = $('#jabDate').value;
    if (!name || !due) return;
    record.jabs.push({ name, due });
    $('#jabName').value = ''; $('#jabDate').value = '';
    await window.Store.save(record); renderLog(); drawSummary();
  };

  /* ---------- theme ---------- */
  const savedTheme = localStorage.getItem('mama.theme');
  document.documentElement.dataset.theme = savedTheme || 'day';
  $('#theme').onclick = () => {
    const n = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    document.documentElement.dataset.theme = n;
    localStorage.setItem('mama.theme', n);
  };
  $('#wipe').onclick = () => {
    if (!confirm('Clear every profile saved in this browser? This cannot be undone.')) return;
    Object.keys(localStorage).filter((k) => k.startsWith('mama.')).forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  function renderAll() {
    if (!record) {
      ['#summaryCard', '#logCard', '#schedCard'].forEach((s) => $(s).hidden = true);
      $('#profiles').innerHTML = '<span class="hint">No profile yet — create one below.</span>';
      ['#wkNow', '#daysLeft', '#dueOut', '#pct'].forEach((s) => $(s).textContent = '—');
      return;
    }
    $('#lmp').value = record.lmp; $('#due').value = record.due;
    $('#bornAt').value = record.bornAt; $('#babyName').value = record.name2 || '';
    drawProfiles();
    renderNow(); renderTimeline(); renderDocs(); renderBag(); renderQs();
    renderLog(); drawSummary();
  }

  (async () => {
    bindAnchors();
    record = await window.Store.load();
    if (!record) {
      const list = await window.Store.listProfiles();
      if (list.length) { window.Store.setActive(list[0].id); record = await window.Store.load(); }
    }
    renderAll();
    document.documentElement.dataset.ready = '1';
  })();
})();
