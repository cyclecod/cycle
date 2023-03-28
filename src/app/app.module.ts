/*
 * @Author: 九阳
 * @Date: 2022-07-26 14:32:53
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-01 17:45:55
 */
import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { SharedModule } from './shared/shared.module';

import { HttpService } from './service/http.service';
import { CheckService } from './service/check.service';
import { ElectronService } from './service/electron.service';
import { LocalStorageStore } from './service/local-storage.service';
import { LoadingService } from './service/loading.service';
import { LoadingComponent } from './components/loading/loading.component';

const service = [
  HttpService,
  CheckService,
  ElectronService,
  LocalStorageStore,
  LoadingService];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, LoadingComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    NgZorroAntdMobileModule,
  ],
  providers: [...service],
  bootstrap: [AppComponent],
})
export class AppModule {}
