// Midas Beauty Enhanced Service Worker
// Version 2.1.0 - Multi-Brand PWA Support

const CACHE_VERSION = '2.1.0';
const STATIC_CACHE = `midas-beauty-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `midas-beauty-dynamic-v${CACHE_VERSION}`;
const BRAND_CACHE = `midas-beauty-brands-v${CACHE_VERSION}`;
const PRODUCT_CACHE = `midas-beauty-products-v${CACHE_VERSION}`;
const IMAGE_CACHE = `midas-beauty-images-v${CACHE_VERSION}`;

const OFFLINE_URL = '/offline.html';
const OFFLINE_FALLBACK_PAGE = '/offline-fallback.html';

// Core app shell - critical for offline functionality
const CORE_CACHE_URLS = [
  '/',
  '/index.html',
  '/products.html',
  '/brands.html',
  '/search-results.html',
  '/about.html',
  '/contact.html',
  '/offline.html',
  '/css/style.css',
  '/js/main.js',
  '/js/search.js',
  '/js/cart.js',
  '/js/pwa.js',
  '/js/brands-categories-system.js',
  '/js/products-database.js',
  '/js/brand-management-system.js',
  '/js/product-detail-system.js',
  '/manifest.json'
];

// Static assets for immediate caching
const STATIC_ASSETS = [
  '/images/favicon.ico',
  '/images/hero-bg.jpg',
  '/images/placeholder.jpg',
  '/images/logo.png',
  // Core product images
  '/images/products/radiance-serum.jpg',
  '/images/products/hydrating-moisturizer.jpg',
  '/images/products/gentle-cleanser.jpg',
  '/images/products/liquid-foundation.jpg',
  '/images/products/volumizing-mascara.jpg',
  '/images/products/repair-shampoo.jpg',
  '/images/products/hydrating-conditioner.jpg'
];

// External resources
const EXTERNAL_RESOURCES = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap'
];

// URL patterns for dynamic caching
const CACHE_PATTERNS = {
  productPages: /\/product-details\/.+\.html$/,
  brandPages: /\/brands\/.+\.html$/,
  productImages: /\/images\/products\/.+\.(jpg|jpeg|png|webp)$/,
  brandImages: /\/images\/brands\/.+\.(jpg|jpeg|png|webp)$/,
  searchResults: /\/search-results\.html\?/,
  productFilters: /\/products\.html\?/
};

// Network-first patterns (for real-time data)
const NETWORK_FIRST_PATTERNS = [
  /\/api\/.*/,
  /analytics/,
  /tracking/
];

// Cache-first patterns (for static content)
const CACHE_FIRST_PATTERNS = [
  /\.css$/,
  /\.js$/,
  /\.(jpg|jpeg|png|gif|webp|svg)$/,
  /fonts\./
];

// Enhanced install event with multi-cache strategy
self.addEventListener('install', event => {
  console.log('Service Worker: Installing Enhanced PWA v' + CACHE_VERSION);

  event.waitUntil(
    Promise.all([
      // Cache core app shell
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching core app shell');
        return cache.addAll(CORE_CACHE_URLS);
      }),

      // Cache static assets
      caches.open(IMAGE_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),

      // Cache external resources with error handling
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching external resources');
        return Promise.allSettled(
          EXTERNAL_RESOURCES.map(url =>
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(error => {
              console.warn('Service Worker: Failed to cache external resource:', url, error);
            })
          )
        );
      })
    ])
    .then(() => {
      console.log('Service Worker: All caches initialized successfully');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('Service Worker: Error during installation:', error);
    })
  );
});

// Enhanced activate event with intelligent cache cleanup
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating Enhanced PWA v' + CACHE_VERSION);

  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, BRAND_CACHE, PRODUCT_CACHE, IMAGE_CACHE];

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Initialize brand and product caches if they don't exist
      caches.open(BRAND_CACHE),
      caches.open(PRODUCT_CACHE),

      // Claim all clients immediately
      self.clients.claim()
    ])
    .then(() => {
      console.log('Service Worker: Enhanced PWA activated successfully');

      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_VERSION
          });
        });
      });
    })
    .catch(error => {
      console.error('Service Worker: Error during activation:', error);
    })
  );
});

// Enhanced fetch event with intelligent caching strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const requestPath = url.pathname;

  // Skip external requests (except allowed CDN resources)
  if (url.origin !== location.origin &&
      !url.hostname.includes('cdnjs.cloudflare.com') &&
      !url.hostname.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(handleFetchRequest(event.request));
});

// Intelligent fetch request handler
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  const requestPath = url.pathname;

  try {
    // Strategy 1: Cache-first for static assets
    if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(requestPath))) {
      return await cacheFirstStrategy(request);
    }

    // Strategy 2: Network-first for real-time data
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
      return await networkFirstStrategy(request);
    }

    // Strategy 3: Stale-while-revalidate for brand pages
    if (CACHE_PATTERNS.brandPages.test(requestPath)) {
      return await staleWhileRevalidateStrategy(request, BRAND_CACHE);
    }

    // Strategy 4: Stale-while-revalidate for product pages
    if (CACHE_PATTERNS.productPages.test(requestPath)) {
      return await staleWhileRevalidateStrategy(request, PRODUCT_CACHE);
    }

    // Strategy 5: Cache-first for product/brand images
    if (CACHE_PATTERNS.productImages.test(requestPath) || CACHE_PATTERNS.brandImages.test(requestPath)) {
      return await imageStrategy(request);
    }

    // Strategy 6: Network-first for search results and filters
    if (CACHE_PATTERNS.searchResults.test(request.url) || CACHE_PATTERNS.productFilters.test(request.url)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }

    // Strategy 7: Navigation requests (app shell)
    if (request.mode === 'navigate') {
      return await navigationStrategy(request);
    }

    // Default: Network-first with dynamic caching
    return await networkFirstStrategy(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('Service Worker: Error handling fetch request:', error);
    return await fallbackStrategy(request);
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return await fallbackStrategy(request);
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request, cacheName = DYNAMIC_CACHE) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return await fallbackStrategy(request);
  }
}

// Stale-while-revalidate strategy for brand/product pages
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  // Update cache in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => {
    // Silently fail background update
  });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cache, wait for network
  try {
    return await fetchPromise;
  } catch (error) {
    return await fallbackStrategy(request);
  }
}

// Image strategy with placeholder fallback
async function imageStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return placeholder for failed images
    return await caches.match('/images/placeholder.jpg') ||
           new Response('', { status: 404 });
  }
}

// Navigation strategy for app shell
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to offline page
    return await caches.match(OFFLINE_URL) ||
           new Response('Offline', { status: 503 });
  }
}

// Fallback strategy for failed requests
async function fallbackStrategy(request) {
  const url = new URL(request.url);

  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    return await caches.match(OFFLINE_URL) ||
           new Response('Offline', { status: 503 });
  }

  // For images, return placeholder
  if (request.destination === 'image') {
    return await caches.match('/images/placeholder.jpg') ||
           new Response('', { status: 404 });
  }

  // For other requests, return appropriate error
  return new Response('Content not available offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });
}

// Background sync for search analytics and cart data
self.addEventListener('sync', event => {
  if (event.tag === 'search-analytics-sync') {
    event.waitUntil(syncSearchAnalytics());
  }
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New update from Midas Beauty',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/images/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/images/icons/dismiss-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Midas Beauty', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Helper functions
async function syncSearchAnalytics() {
  try {
    // Sync search analytics data when online
    console.log('Service Worker: Syncing search analytics');
    // Implementation would depend on backend API
  } catch (error) {
    console.error('Service Worker: Error syncing search analytics:', error);
  }
}

async function syncCartData() {
  try {
    // Sync cart data when online
    console.log('Service Worker: Syncing cart data');
    // Implementation would depend on backend API
  } catch (error) {
    console.error('Service Worker: Error syncing cart data:', error);
  }
}

// Enhanced message handling for PWA communication
self.addEventListener('message', event => {
  const { data } = event;

  if (!data) return;

  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_VERSION,
        caches: [STATIC_CACHE, DYNAMIC_CACHE, BRAND_CACHE, PRODUCT_CACHE, IMAGE_CACHE]
      });
      break;

    case 'CACHE_PRODUCT_PAGE':
      cacheProductPage(data.url);
      break;

    case 'CACHE_BRAND_PAGE':
      cacheBrandPage(data.url);
      break;

    case 'PRELOAD_IMAGES':
      preloadImages(data.images);
      break;

    case 'CLEAR_CACHE':
      clearSpecificCache(data.cacheName);
      break;

    case 'SYNC_DATA':
      triggerBackgroundSync(data.tag);
      break;

    default:
      console.log('Service Worker: Unknown message type:', data.type);
  }
});

// Cache product page on demand
async function cacheProductPage(url) {
  try {
    const cache = await caches.open(PRODUCT_CACHE);
    await cache.add(url);
    console.log('Service Worker: Product page cached:', url);
  } catch (error) {
    console.error('Service Worker: Error caching product page:', error);
  }
}

// Cache brand page on demand
async function cacheBrandPage(url) {
  try {
    const cache = await caches.open(BRAND_CACHE);
    await cache.add(url);
    console.log('Service Worker: Brand page cached:', url);
  } catch (error) {
    console.error('Service Worker: Error caching brand page:', error);
  }
}

// Preload images for better performance
async function preloadImages(imageUrls) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const promises = imageUrls.map(url =>
      fetch(url).then(response => {
        if (response.ok) {
          return cache.put(url, response);
        }
      }).catch(error => {
        console.warn('Service Worker: Failed to preload image:', url);
      })
    );
    await Promise.allSettled(promises);
    console.log('Service Worker: Images preloaded');
  } catch (error) {
    console.error('Service Worker: Error preloading images:', error);
  }
}

// Clear specific cache
async function clearSpecificCache(cacheName) {
  try {
    const deleted = await caches.delete(cacheName);
    console.log('Service Worker: Cache cleared:', cacheName, deleted);
  } catch (error) {
    console.error('Service Worker: Error clearing cache:', error);
  }
}

// Trigger background sync
async function triggerBackgroundSync(tag) {
  try {
    await self.registration.sync.register(tag);
    console.log('Service Worker: Background sync registered:', tag);
  } catch (error) {
    console.error('Service Worker: Error registering background sync:', error);
  }
}

// Utility functions for offline data management
async function getOfflineData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match(`/offline-data/${key}`);
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Service Worker: Error getting offline data:', error);
  }
  return null;
}

async function setOfflineData(key, data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(`/offline-data/${key}`, response);
  } catch (error) {
    console.error('Service Worker: Error setting offline data:', error);
  }
}

async function clearOfflineData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.delete(`/offline-data/${key}`);
  } catch (error) {
    console.error('Service Worker: Error clearing offline data:', error);
  }
}
