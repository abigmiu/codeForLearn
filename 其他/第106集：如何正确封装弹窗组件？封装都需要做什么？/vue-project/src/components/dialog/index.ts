import { createApp } from 'vue';
import DialogComponent from './DialogComponent.vue';

export function showModal(title: string, onClick: () => void) {
    const modal = createApp(DialogComponent, {
        title,
        onClick: () => {
            onClick();
            // 卸载组件和 dom 元素
            modal.unmount();
            div.remove();
        }
    });
    const div = document.createElement('div');
    modal.mount(div);
    document.body.appendChild(div);
}
