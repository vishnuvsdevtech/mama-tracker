/* Storage layer — the seam that lets a backend replace localStorage later.

 * Every read and write in the app goes through this object. Swapping to a real
 * database means replacing `LocalStore` with an `ApiStore` that has the same
 * four methods and the same promise shapes; nothing above this line changes.
 *
 *   load()            -> Promise<Record>
 *   save(record)      -> Promise<void>
 *   listProfiles()    -> Promise<[{ id, name }]>
 *   activeId() / setActive(id)
 */
window.Store = (() => {
  const PREFIX = 'mama.profile.';
  const ACTIVE = 'mama.active';
  const DIR = 'mama.profiles';

  const blank = (name) => ({
    id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name || 'My profile',
    createdAt: new Date().toISOString(),
    // pregnancy side
    lmp: '', due: '', docs: {}, qs: [],
    // birth side: once bornAt is set the page counts up instead of down
    bornAt: '',
    name2: '',           // the child's name, if they add one
    log: [],             // { at, kind, note }
    // doctor-provided schedule the parent types in; never authored here
    jabs: [],
  });

  const read = (k, fallback) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const LocalStore = {
    async listProfiles() {
      return (read(DIR, []) || []).map(({ id, name }) => ({ id, name }));
    },
    async load() {
      const id = localStorage.getItem(ACTIVE);
      if (!id) return null;
      return read(PREFIX + id, null);
    },
    async save(record) {
      write(PREFIX + record.id, record);
      const dir = read(DIR, []) || [];
      const i = dir.findIndex((p) => p.id === record.id);
      const entry = { id: record.id, name: record.name };
      if (i < 0) dir.push(entry); else dir[i] = entry;
      write(DIR, dir);
      localStorage.setItem(ACTIVE, record.id);
    },
    async create(name) {
      const r = blank(name);
      await LocalStore.save(r);
      return r;
    },
    async remove(id) {
      localStorage.removeItem(PREFIX + id);
      write(DIR, (read(DIR, []) || []).filter((p) => p.id !== id));
      if (localStorage.getItem(ACTIVE) === id) localStorage.removeItem(ACTIVE);
    },
    activeId() { return localStorage.getItem(ACTIVE); },
    setActive(id) { localStorage.setItem(ACTIVE, id); },
  };

  return LocalStore;
})();
