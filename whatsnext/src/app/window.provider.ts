// This is used to get the current hostname.
// It is required so that we can display the client URL from the master page
// see
// https://stackoverflow.com/questions/36222845/how-to-get-domain-name-for-service-in-angular2
// for implementation details
import { InjectionToken, FactoryProvider } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [
    windowProvider
]
