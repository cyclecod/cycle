/*
 * @Author: 堵世颖
 * @Date: 2021-02-18 14:05:31
 * @LastEditors: 堵世颖
 * @LastEditTime: 2021-02-19 14:09:48
 */
import { InjectionToken } from '@angular/core';
import { DA_STORE_TOKEN_LOCAL_FACTORY } from './local-storage.service';

export const DA_STORE_TOKEN = new InjectionToken<IStore>('AUTH_STORE_TOKEN', {
    providedIn: 'root',
    factory: DA_STORE_TOKEN_LOCAL_FACTORY,
});

// tslint:disable-next-line: interface-name
export interface IStore {
    get(key: string): object;

    set(key: string, value: object): boolean;

    remove(key: string): void;

    check(key: string): boolean;
}
