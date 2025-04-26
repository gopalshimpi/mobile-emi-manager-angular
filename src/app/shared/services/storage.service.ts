import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Set value to localStorage.
   * @param {String} key
   * @param {any} value
   * @returns {void}
   */
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieve value from localStorage.
   * @param {string} key
   * @returns {any}
   */
  get(key: string): any {
    let item = null;
    if (localStorage.getItem(key)) {
      item = JSON.parse(localStorage.getItem(key) as any);
    }
    return item;
  }

  /**
   * Remove value from localStorage.
   * @param {string} key
   * @returns {void}
   */
  delete(key: string): void {
    localStorage.removeItem(key);
  }
}
