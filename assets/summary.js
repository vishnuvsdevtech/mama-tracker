/* The summary — plain sentences about what they recorded and what is next.

 * Deliberately not analysis. A single family's record has no statistical
 * signal, so anything "insightful" would be invented. This describes the
 * record and does date arithmetic on it, and says so.
 */
window.Summary = (() => {
  const DAY = 86400000;
  const parse = (s) => (s ? new Date(s + 'T00:00:00') : null);
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtShort = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // Naegele, and the reverse. Conventions, not measurements.
  const dueFromLmp = (lmp) => addDays(lmp, 280);
  const lmpFromDue = (due) => addDays(due, -280);

  const ageOf = (bornAt, now) => {
    const days = Math.round((now - bornAt) / DAY);
    if (days < 0) return { days, label: 'not born yet' };
    if (days < 14) return { days, label: days === 0 ? 'born today' : `${days} day${days === 1 ? '' : 's'} old` };
    if (days < 60) return { days, label: `${Math.floor(days / 7)} weeks old` };
    const months = Math.floor(days / 30.44);
    if (months < 24) return { days, label: `${months} month${months === 1 ? '' : 's'} old` };
    return { days, label: `${Math.floor(months / 12)} years old` };
  };

  // Jabs the parent typed in — shown as given, ordered by date
  const upcomingJabs = (record, now) => (record.jabs || [])
    .map((j) => ({ ...j, when: parse(j.due) }))
    .filter((j) => j.when && (j.when - now) / DAY >= -1)
    .sort((a, b) => a.when - b.when)
    .slice(0, 4);

  function build(record, now = new Date()) {
    now = new Date(now); now.setHours(0, 0, 0, 0);
    const lines = [];
    const born = parse(record.bornAt);

    if (born && born <= now) {
      /* ---- after birth: count up ---- */
      const age = ageOf(born, now);
      const birth = record.name2 ? record.name2 : 'the baby';
      lines.push(`${birth} is ${age.label} (born ${fmt(born)}).`);

      const since = (record.log || []).filter((l) => new Date(l.at) >= addDays(now, -7));
      if (since.length) {
        const by = since.reduce((m, l) => (m[l.kind] = (m[l.kind] || 0) + 1, m), {});
        const parts = Object.entries(by).map(([k, n]) => `${n} ${k}`);
        lines.push(`${since.length} entries in the last week${parts.length ? `: ${parts.join(', ')}` : ''}.`);
      } else {
        lines.push('Nothing logged in the last week — no judgement, some weeks are like that.');
      }

      const jabs = upcomingJabs(record, now);
      if (jabs.length) {
        const j = jabs[0];
        const d = Math.round((j.when - now) / DAY);
        const rel = d <= 0 ? 'now' : d === 1 ? 'tomorrow' : `in ${d} days`;
        lines.push(`Next item on your schedule: ${j.name}, ${rel} (${fmtShort(j.when)}).`);
      } else if (!(record.jabs || []).length) {
        lines.push('No immunisation dates added — type in the schedule your paediatrician gave you and they will show here.');
      }
      return lines;
    }

    if (born) {
      const d = Math.round((born - now) / DAY);
      lines.push(`Due in ${d} day${d === 1 ? '' : 's'} (${fmt(born)}). A date, not a deadline.`);
    }

    /* ---- before birth: count down ---- */
    const due = born || (record.lmp ? dueFromLmp(parse(record.lmp)) : null);
    if (!due) {
      lines.push('No dates entered yet. Add the first day of your last period, or the due date the doctor gave you.');
    } else {
      const start = lmpFromDue(due);
      const week = Math.max(0, Math.floor((now - start) / DAY / 7));
      const left = Math.round((due - now) / DAY);
      const tri = week < 13 ? 'first' : week < 28 ? 'second' : 'third';
      lines.push(`Week ${week} — ${tri} trimester, ${left} days to go.`);
    }

    const docsDone = Object.values(record.docs || {}).filter(Boolean).length;
    const docsTotal = 14;
    if (docsDone) lines.push(`${docsDone} of ${docsTotal} documents collected.`);
    else lines.push('No documents ticked off yet.');

    const qs = (record.qs || []).length;
    if (qs) lines.push(`${qs} question${qs === 1 ? '' : 's'} waiting for your next visit.`);

    return lines;
  }

  return { build, ageOf, dueFromLmp, lmpFromDue, fmt, fmtShort, parse, addDays };
})();
