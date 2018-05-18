import Places from './components/dashboard/place/Places';
import Place from './components/dashboard/place/Place';
import Sugars from './components/dashboard/sugar/Sugars';
import Wines from './components/dashboard/wine/Wines';
import Wine from './components/dashboard/wine/Wine';
import Winemakers from './components/dashboard/winemaker/Winemakers';
import Winemaker from './components/dashboard/winemaker/Winemaker';
import WineTypes from './components/dashboard/wine-type/WineTypes';
import Varieties from './components/dashboard/variety/Varieties';
import Variety from './components/dashboard/variety/Variety';
import Dashboard from './components/dashboard/Dashboard';
import Packages from './components/dashboard/package/Packages';
import Login from './components/Login';

export default [
  {
    path: '/', component: Dashboard, children: [
      { path: '', redirect: '/login' },
      { path: '/sladkor', component: Sugars },
      { path: '/kraji', component: Places },
      { path: '/kraji/:id', name: 'place', component: Place },
      { path: '/vina', component: Wines },
      { path: '/vina/:id', name: 'wine', component: Wine },
      { path: '/vinarji', component: Winemakers },
      { path: '/vinarji/:id', name: 'winemaker', component: Winemaker },
      { path: '/vrste', component: WineTypes },
      { path: '/sorte', component: Varieties },
      { path: '/sorte/:id', name: 'variety', component: Variety },
      { path: '/paketi', component: Packages },
    ]
  },
  { path: '/login', component: Login },
];
