// Versione statica (demo): nessun backend. I dati sono uno snapshot del
// simulatore salvato in public/data/*.json; login e preferenze restano nel browser.
// shortcut: la password è nel JS, quindi non è una vera protezione; per proteggere davvero serve un'auth lato host (es. Cloudflare Pages).

const DEMO_USER = 'veil'
const DEMO_PASSWORD = '2013'
const SESSION_KEY = 'demo_ems_user'
const BASE = import.meta.env.BASE_URL

async function load(path) {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`Errore ${res.status}`)
  return res.json()
}

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

function saveUser(user) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* storage non disponibile: la sessione dura fino al refresh */
  }
  return { user }
}

let current = readUser()

async function newUser() {
  const { clients } = await load('clients.json')
  return {
    id: 'demo',
    email: DEMO_USER,
    name: 'Veil',
    role: 'admin',
    clients: clients.map((c) => c.id),
    theme: 'dark',
    lang: 'it',
  }
}

function patchUser(patch) {
  if (!current) return Promise.reject(new Error('Non autenticato'))
  current = { ...current, ...patch }
  return Promise.resolve(saveUser(current))
}

export const api = {
  me: () => (current ? Promise.resolve({ user: current }) : Promise.reject(new Error('Non autenticato'))),
  login: async (email, password) => {
    if (email !== DEMO_USER || password !== DEMO_PASSWORD) throw new Error('Credenziali non valide')
    current = await newUser()
    return saveUser(current)
  },
  register: () => Promise.reject(new Error('Registrazione non disponibile nella demo')),
  logout: async () => {
    current = null
    return saveUser(null)
  },
  setTheme: (theme) => patchUser({ theme }),
  setLanguage: (lang) => patchUser({ lang }),
  clients: () => load('clients.json'),
  tags: (client = 'cliente-1') => load(`tags/${client}.json`),
  history: async (aux, tag, hours = 24) => (await load(`history/${aux}.json`))[tag][hours],
  maintenance: (client = 'cliente-1') => load(`maintenance/${client}.json`),
}
