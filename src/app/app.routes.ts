import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { ReactComponent } from './react';
import { ProfileComponent } from './profile';
import { LoginComponent } from './login'
import { RegisteComponent } from './registe'
import { NoContentComponent } from './no-content';
import { GoodsComponent } from './goods/goods.component'
import { AddGoodsComponent } from './addGoods';
import { DataResolver } from './app.resolver';
import { MarketComponent } from './market/goods.component'
import { CartComponent } from './cart/goods.component'
import {BoughtComponent} from './bought/goods.component'
import { GoodProfileComponent } from './goodProfile/goods.component'
import { AdminComponent } from './admin/goods.component'


export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts', loadChildren: './posts#PostsModule' },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'react', component: ReactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registe', component: RegisteComponent },
  { path: 'addGoods', component: AddGoodsComponent },
  { path: 'market', component: MarketComponent },
  { path: 'cart', component: CartComponent },
  { path: 'goods', component: GoodsComponent },
  { path: 'goods/:id', component: GoodProfileComponent },
  { path: 'bought', component: BoughtComponent},
  { path: 'admin', component: AdminComponent },
  { path: '**', component: NoContentComponent },
];
