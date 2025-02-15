import {isMatchMediaChangeEventListenerSupported} from './platform';

let query: MediaQueryList = null;
const onChange: ({matches}: {matches: boolean}) => void = ({matches}) => listeners.forEach((listener) => listener(matches));
const listeners = new Set<(isDark: boolean) => void>();

export function runColorSchemeChangeDetector(callback: (isDark: boolean) => void) {
    listeners.add(callback);
    if (query) {
        return;
    }
    query = matchMedia('(prefers-color-scheme: dark)');
    if (isMatchMediaChangeEventListenerSupported) {
        query.addEventListener('change', onChange);
    } else {
        query.addListener(onChange);
    }
}

export function stopColorSchemeChangeDetector() {
    if (!query || !onChange) {
        return;
    }
    if (isMatchMediaChangeEventListenerSupported) {
        query.removeEventListener('change', onChange);
    } else {
        query.removeListener(onChange);
    }
    listeners.clear();
    query = null;
}

export const isSystemDarkModeEnabled = () => (query || matchMedia('(prefers-color-scheme: dark)')).matches;
