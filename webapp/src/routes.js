import Dashboard from './components/dashboard/Dashboard';
import GenerateModel from './components/dashboard/model/GenerateModel';
import ManualModel from './components/dashboard/model/ManualModel';
import Packages from './components/dashboard/package/Packages';
import Place from './components/dashboard/place/Place';
import Places from './components/dashboard/place/Places';
import Sugars from './components/dashboard/sugar/Sugars';
import Varieties from './components/dashboard/variety/Varieties';
import Variety from './components/dashboard/variety/Variety';
import WineLabels from './components/dashboard/wine-label/WineLabels';
import WinesLabels from './components/dashboard/wine-label/WinesLabels';
import WineTypes from './components/dashboard/wine-type/WineTypes';
import Wine from './components/dashboard/wine/Wine';
import Wines from './components/dashboard/wine/Wines';
import Winemaker from './components/dashboard/winemaker/Winemaker';
import WinemakerEdit from './components/dashboard/winemaker/WinemakerEdit';
import Winemakers from './components/dashboard/winemaker/Winemakers';
import Login from './components/Login';

export default [
  {
    path: '/', component: Dashboard, children: [
      { path: '', redirect: '/login' },
      { path: '/sladkor', component: Sugars },
      { path: '/kraji', component: Places },
      { path: '/kraji/:id', name: 'place', component: Place },
      { path: '/vina', name: 'wines', component: Wines },
      { path: '/vina/:id', name: 'wine', component: Wine },
      { path: '/vinarji', component: Winemakers },
      { path: '/vinarji/:id', name: 'winemaker', component: Winemaker },
      { path: '/vinarji/:id/urejaj', name: 'winemaker-edit', component: WinemakerEdit },
      { path: '/vrste', component: WineTypes },
      { path: '/sorte', component: Varieties },
      { path: '/sorte/:id', name: 'variety', component: Variety },
      { path: '/paketi', component: Packages },
      { path: '/etikete', component: WinesLabels },
      { path: '/etikete/:id', name: 'wine-label', component: WineLabels },
      { path: '/model/generacija', component: GenerateModel },
      { path: '/model/rocno', component: ManualModel },
      
    ]
  },
  { path: '/login', component: Login },
];
