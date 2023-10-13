import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let query = ''; // - зберігає поточний запит користувача.
let page = 1; //- зберігає поточну сторінку результатів.
let simpleLightBox; //- об'єкт SimpleLightbox, який ініціалізується пізніше.
const perPage = 40; // - кількість зображень на сторінці.

searchForm.addEventListener('submit', onSearchForm); //має обробник подій onSearchForm, який викликається при відправці форми пошуку.

//Ця функція призначена для відображення зображень у галереї.
// Зображення отримуються в параметрі images, як масив.
// Кожне зображення вставляється в розмітку галереї з використанням insertAdjacentHTML.
function renderGallery(images) {

  if (!gallery) {
    return;
  }

  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

// Ця функція викликається при відправці форми пошуку.
// Вона запобігає перезавантаженню сторінки за допомогою e.preventDefault().
// Зчитує запит користувача з поля форми та очищує галерею.
// Перевіряє, чи запит не порожній.
// Викликає функцію fetchImages для отримання зображень з вказаним запитом.
// Відображає результати в галереї, використовуючи renderGallery.
// Відображає сповіщення про кількість знайдених зображень.
function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

