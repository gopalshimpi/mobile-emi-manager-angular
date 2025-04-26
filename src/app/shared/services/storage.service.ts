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
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Remove value from localStorage.
   * @param {string} key
   * @returns {void}
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
