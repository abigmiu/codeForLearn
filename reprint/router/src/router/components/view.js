export default {

        functional: true,
        render(h, { parent, data }) {

            console.log('router-view');

            const route = parent.$route;
            const matched = route.matched;

            data.routerView = true;

            let depth = 0;

            while(parent) {
                if (parent.$vnode && parent.$vnode.data.routerView) {
                    depth++;
                }
                parent = parent.$parent;
            }

            let record = matched[depth];
            if (!record) {
                return h();
            }

            let component = record.component
            return h(component, data);
        }


}
