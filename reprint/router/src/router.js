import VueRouter from "./router/index";
import Home from './views/Home.vue';
import About from './views/About.vue';

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            children: [
                {
                    path: 'a',
                    component: {
                        render(h) {
                            return h('h1', 'about a')
                        }
                    }
                }
            ]
        }
    ]
})
