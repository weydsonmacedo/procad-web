
 
 // export default class authCookie{
 //   _name: string;
 //   constructor(name: string){
 //     this._name = name
 //   }
 
 //   get(){
 //     return this._name
 //   }
 
 //   set(payload: string, expDate: Date){
 //     const token = `${this._name}=${payload}`
 //     const path = "path=/";
 //     const expires = `expires=${expDate.toUTCString()};`
 //   }
 
 //   erase(){
 
 //   }
 // }
 
  export function set(authCookie) {
     const token = `${authCookie.name}=${authCookie.value || ''};`;
     const path = "path=/"
     const expires = authCookie.date ? `expires=${authCookie.date.toUTCString()};` : ''
     document.cookie = token+expires+path;
    }
   
    export function get(name) {
      let nameEQ = name + '=';
      let ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
       let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
       if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return "";
    }
   
    export function erase(name) {
      document.cookie = name + '=; max-Age=-99999999;';
    }