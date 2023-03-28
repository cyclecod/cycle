/*
 * @Author: 堵世颖
 * @Date: 2021-02-18 14:05:31
 * @LastEditors: 李九阳
 * @LastEditTime: 2021-06-01 18:09:53
 */
import { IStore } from './interface';

export function DA_STORE_TOKEN_LOCAL_FACTORY(): IStore {
    return new LocalStorageStore();
}

/**
 * `localStorage` storage, **not lost after closing the browser**.
 *
 * ```ts
 * // global-config.module.ts
 * { provide: DA_STORE_TOKEN, useClass: LocalStorageStore }
 * ```
 */
export class LocalStorageStore implements IStore {
    get(key: string): object {
        return JSON.parse(localStorage.getItem(key) || '{}') || {};
    }

    set(key: string, value: object | null): boolean {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }

    check(key: string): boolean {
        if (localStorage.getItem(key) === null) {
            return false;
        } else {
            return true;
        }
    }
}
