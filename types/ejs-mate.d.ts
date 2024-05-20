declare module 'ejs-mate' {
    import { Options, Data } from 'ejs';
  
    interface EjsMateOptions extends Options {
      // add any additional options specific to ejs-mate if you know them
    }
  
    function ejsMate(path: string, data?: Data, options?: EjsMateOptions): Promise<string>;
  
    export = ejsMate;
  }