import axios from 'axios';
 
import { KEY } from './api-key.js';

// Цей інтерцептор перехоплює відповіді на запити Axios.
// Якщо відповідь успішна, вона повертається без змін.
// Якщо відповідь невдала (помилка), викликається сповіщення Notiflix
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  },
);

// Ця функція призначена для запиту до сервера Pixabay API для отримання зображень на основі параметрів, переданих як аргументи.
// Запит виконується за допомогою axios.get().
// У URL запиту включені наступні параметри:
// key - ключ API, який імпортується з модулю 'api-key.js'.
// q - запит користувача для пошуку зображень.
// image_type - тип зображення (photo).
// orientation - орієнтація зображення (горизонтальна).
// safesearch - фільтр безпеки для зображень (увімкнено).
// page - номер сторінки результатів.
// per_page - кількість зображень на сторінці.
// Після успішного виконання запиту відповідь парситься, і дані повертаються в об'єкті response.data.
async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response.data;
}

export { fetchImages };