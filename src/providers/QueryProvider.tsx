'use client'

import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { del, get, set } from 'idb-keyval'
import { useState } from 'react'

const indexedDBPersister = createAsyncStoragePersister({
  storage: {
    getItem: async (key: string) => await get(key),
    setItem: async (key: string, value: unknown) => await set(key, value),
    removeItem: async (key: string) => await del(key),
  },
  throttleTime: 2000,
  key: 'pokemon-cache',
  serialize: JSON.stringify,
  deserialize: JSON.parse,
})

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000, // fraish data 1h
        gcTime: 24 * 60 * 60 * 1000, // garbage collection time 24h
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: 'always',
      },
    },
  }))

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: indexedDBPersister,
        maxAge: 7 * 24 * 60 * 60 * 1000, // data concerved 7 days in indexedDB
        buster: 'pokemon-v1.0', // cache version
        dehydrateOptions: { // only keep successfull queries to avoid corrupted data
          shouldDehydrateQuery: (query) => {
            return query.state.status === 'success' && 
                   query.queryKey[0] === 'pokemon'
          },
        },
      }}
      onSuccess={() => {
        console.log('✅ Cache Pokémon restauré depuis IndexedDB')
      }}
      onError={() => {
        console.warn('⚠️ Erreur lors de la restauration du cache')
      }}
    >
      {children}
      <ReactQueryDevtools 
        initialIsOpen={false} 
        buttonPosition="bottom-left"
      />
    </PersistQueryClientProvider>
  )
}