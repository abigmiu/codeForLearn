import { customRef } from 'vue';
import { debounce } from './helpers';

/** 防抖Ref */
export function debounceRef(value, delay = 1000) {
    return customRef((track, trigger) => {
        const update = debounce((newValue) => {
            value = newValue;
            trigger();
        }, delay);
        return {
            get() {
                track();
                return value;
            },
            set(newValue) {
                console.log('set');
                update(newValue);
            },
        };
    });
}

export function delayLoadingRef(status, delay = 200) {
    let realStatus = status;
    let displayStatus = status;
    let timer;
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                console.log('get', realStatus, displayStatus);
                return { realStatus, displayStatus };
            },
            set(status) {
                console.log('set status', status);
                if (status) {
                    timer = setTimeout(() => {
                        displayStatus = status;
                        timer = null;
                        trigger();
                    }, delay);
                } else {
                    displayStatus = status;
                    if (timer) {
                        clearTimeout(timer);
                    } 
                }
                realStatus = status;
                trigger();
            },
        };
    });
}
