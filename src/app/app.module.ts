import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApolloModule } from 'apollo-angular';
import { client } from '../graphql.client';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import {
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatGridListModule
} from '@angular/material';
import 'hammerjs';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from "@angular/common";

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { ReactComponent } from './react';
import { ProfileComponent } from './profile';
import { LoginComponent } from './login'
import { RegisteComponent } from './registe'
import {GoodsComponent} from './goods/goods.component'
import {AddGoodsComponent} from './addGoods/addGoods.component'
import {MarketComponent} from './market/goods.component'
import {CartComponent} from './cart/goods.component'
import { BoughtComponent } from './bought/goods.component'
import { GoodProfileComponent } from './goodProfile/goods.component'
import { AdminComponent } from './admin/goods.component'
import { NoContentComponent } from './no-content';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import '../styles/styles.scss';
import '../styles/headings.css';

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    ReactComponent,
    ProfileComponent,
    NoContentComponent,
    LoginComponent,
    RegisteComponent,
    GoodsComponent,
    AddGoodsComponent,
    MarketComponent,
    CartComponent,
    BoughtComponent,
    GoodProfileComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    ApolloModule.forRoot(client),
    HttpClientModule,
  ],
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    CookieService
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    store.restoreInputValues = createInputTransfer();
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
