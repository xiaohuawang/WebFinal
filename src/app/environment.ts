import {
  enableDebugTools,
  disableDebugTools
} from '@angular/platform-browser';
import {
  ApplicationRef,
  enableProdMode
} from '@angular/core';

let PROVIDERS: any[] = [

];

let _decorateModuleRef = <T>(value: T): T => { return value; };

if ('production' === ENV) {
  enableProdMode();

  /**
   * Production
   */
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  PROVIDERS = [
    ...PROVIDERS,
    /**
     * Custom providers in production.
     */
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    let _ng = (<any> window).ng;
    enableDebugTools(cmpRef);
    (<any> window).ng.probe = _ng.probe;
    (<any> window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  /**
   * Development
   */
  PROVIDERS = [
    ...PROVIDERS,
    /**
     * Custom providers in development.
     */
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
