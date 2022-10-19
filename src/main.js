import { createApp } from 'vue';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';

createApp(App).use(VueAxios, axios).mount('#app');
