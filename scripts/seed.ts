import { readFileSync } from 'node:fs'
import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function loadCredential(): ServiceAccount {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount
  }
  return JSON.parse(readFileSync(new URL('../service-account.json', import.meta.url), 'utf8')) as ServiceAccount
}

initializeApp({ credential: cert(loadCredential()) })
const db = getFirestore()

const settings = {
  farm_name: 'TS Mango Farming',
  phone: '9843823047',
  phone_secondary: '9600336404',
  whatsapp_primary: '9344904430',
  instagram: 'ts.farming',
  email: 'ts.farmingts@gmail.com',
  upi_id: '9965053956@upi',
}

const varieties = [
  { item_id: 'mango_alphonsa',     category: 'Mango',     variety_name: 'Alphonsa',        description: '', price: 250, unit: 'kg', is_available: true,  min_order: 1    },
  { item_id: 'mango_mallika',      category: 'Mango',     variety_name: 'Mallika',         description: '', price: 200, unit: 'kg', is_available: true,  min_order: 1    },
  { item_id: 'mango_kesar',        category: 'Mango',     variety_name: 'Kesar',           description: '', price: 220, unit: 'kg', is_available: true,  min_order: 1    },
  { item_id: 'mango_neelam',       category: 'Mango',     variety_name: 'Neelam',          description: '', price: 180, unit: 'kg', is_available: false, min_order: 1    },
  { item_id: 'mango_banganapalli', category: 'Mango',     variety_name: 'Banganapalli',    description: '', price: 190, unit: 'kg', is_available: true,  min_order: 1    },
  { item_id: 'mango_himampasanth', category: 'Mango',     variety_name: 'Himampasanth',    description: '', price: 170, unit: 'kg', is_available: true,  min_order: 1    },
  { item_id: 'mango_sendhuram',    category: 'Mango',     variety_name: 'Sendhuram',       description: '', price: 210, unit: 'kg', is_available: true,  min_order: 1    },
  { item_id: 'jackfruit_raw',      category: 'Jackfruit', variety_name: 'Raw Jackfruit',   description: '', price: 60,  unit: 'kg', is_available: true,  min_order: 2    },
  { item_id: 'jackfruit_ripe',     category: 'Jackfruit', variety_name: 'Ripe Jackfruit',  description: '', price: 80,  unit: 'kg', is_available: true,  min_order: 2    },
  { item_id: 'jackfruit_baby',     category: 'Jackfruit', variety_name: 'Baby Jackfruit',  description: '', price: 90,  unit: 'kg', is_available: false, min_order: 1    },
  { item_id: 'jackfruit_dried',    category: 'Jackfruit', variety_name: 'Dried Jackfruit', description: '', price: 350, unit: 'kg', is_available: true,  min_order: 0.5  },
  { item_id: 'honey_forest',       category: 'Honey',     variety_name: 'Forest Honey',    description: '', price: 600, unit: 'kg', is_available: true,  min_order: 0.5  },
  { item_id: 'honey_wild',         category: 'Honey',     variety_name: 'Wild Honey',      description: '', price: 850, unit: 'kg', is_available: true,  min_order: 0.5  },
  { item_id: 'honey_beeswax',      category: 'Honey',     variety_name: 'Beeswax',         description: '', price: 400, unit: 'kg', is_available: false, min_order: 0.25 },
  { item_id: 'honey_ginger',       category: 'Honey',     variety_name: 'Ginger Honey',    description: '', price: 700, unit: 'kg', is_available: true,  min_order: 0.5  },
]

async function main() {
  const now = new Date().toISOString()
  await db.collection('settings').doc('config').set(settings, { merge: true })
  console.log('Seeded settings/config')

  const batch = db.batch()
  for (const variety of varieties) {
    const ref = db.collection('varieties').doc(variety.item_id)
    batch.set(ref, { ...variety, updated_at: now }, { merge: true })
  }
  await batch.commit()
  console.log(`Seeded ${varieties.length} varieties`)
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error('Seed FAILED:', message)
  process.exit(1)
})
