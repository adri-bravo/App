;
//asignar un nombre y versión al cache
const CACHE_NAME = 'anotaped_v1',
  urlsToCache = [
    './',
    'https://code.jquery.com/jquery-latest.min.js',
    './sha1.js',
    './node_modules/@vaadin/vaadin-date-picker/vaadin-date-picker.js',
    './node_modules/@vaadin/vaadin-button/vaadin-button.js',
    './node_modules/@polymer/iron-icon/iron-icon.js',
    './node_modules/@polymer/iron-icons/iron-icons.js',
    './node_modules/@vaadin/vaadin-icons/vaadin-icons.js',
    './node_modules/@vaadin/vaadin-combo-box/vaadin-combo-box.js',
    './node_modules/@vaadin/vaadin-text-field/vaadin-text-field.js',
    './node_modules/@vaadin/vaadin-grid/all-imports.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    './styles/style_page.css',
    './styles/style_general.js',
    './script.js',
    './images/favicon.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})
