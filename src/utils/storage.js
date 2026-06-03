// ─── Datasource selection (persisted in localStorage) ────────────────────────
// Call setBackend('local' | 'db') to switch at runtime.
// All storage methods route dynamically based on the current value.

const BACKEND_KEY = 'fi_datasource';

export function getBackend() {
  return localStorage.getItem(BACKEND_KEY) || 'db';
}

export function setBackend(backend) {
  localStorage.setItem(BACKEND_KEY, backend);
}

// ─── localStorage ────────────────────────────────────────────────────────────

const LS_PROFILES = 'fi_profiles';
const LS_ACTIVE   = 'fi_active_profile';

const localStore = {
  async loadProfiles() {
    try { return JSON.parse(localStorage.getItem(LS_PROFILES) || '[]'); }
    catch { return []; }
  },
  async persistProfiles(profiles) {
    localStorage.setItem(LS_PROFILES, JSON.stringify(profiles));
  },
  async getActiveProfileId() {
    return localStorage.getItem(LS_ACTIVE) || null;
  },
  async setActiveProfileId(id) {
    localStorage.setItem(LS_ACTIVE, id || '');
  },
};

// ─── Supabase ────────────────────────────────────────────────────────────────
// Required env vars (add to .env):
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
//
// Required SQL (run once in Supabase SQL editor):
//   create table fi_data (key text primary key, value jsonb not null default '{}');

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

async function sbGet(key) {
  const { data, error } = await supabase
    .from('fi_data')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) { console.error('[storage]', error.message); return null; }
  return data?.value ?? null;
}

async function sbSet(key, value) {
  const { error } = await supabase.from('fi_data').upsert({ key, value });
  if (error) console.error('[storage]', error.message);
}

const supabaseStore = {
  async loadProfiles() {
    const data = await sbGet('profiles');
    return Array.isArray(data) ? data : [];
  },
  async persistProfiles(profiles) {
    await sbSet('profiles', profiles);
  },
  async getActiveProfileId() {
    const id = await sbGet('active_profile_id');
    return typeof id === 'string' ? id : null;
  },
  async setActiveProfileId(id) {
    await sbSet('active_profile_id', id ?? null);
  },
};

// ─── Dynamic router ───────────────────────────────────────────────────────────
// Reads getBackend() on every call so switching datasource takes effect
// immediately without a page reload.

export const storage = {
  loadProfiles:       ()           => getBackend() === 'db' ? supabaseStore.loadProfiles()            : localStore.loadProfiles(),
  persistProfiles:    (profiles)   => getBackend() === 'db' ? supabaseStore.persistProfiles(profiles)  : localStore.persistProfiles(profiles),
  getActiveProfileId: ()           => getBackend() === 'db' ? supabaseStore.getActiveProfileId()       : localStore.getActiveProfileId(),
  setActiveProfileId: (id)         => getBackend() === 'db' ? supabaseStore.setActiveProfileId(id)     : localStore.setActiveProfileId(id),
};
