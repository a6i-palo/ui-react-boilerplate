// Make Typescript recognize scss files as modules so we can import styles without complaints
declare module '*.scss';

declare module '*.svg' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

declare module 'my-globals' {
    global {
        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface Window {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
        }
    }
}
