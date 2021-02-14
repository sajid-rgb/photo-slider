const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const main = document.querySelector('.main')
// selected image 
let sliders = [];
// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';
// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 ';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
    toggleSpinner(false);
  })
}
const getImages = (query) => {
  toggleSpinner(true);
  main.style.display = 'none'
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo &pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}
let slideIndex = 0;
let count = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
  } else {
    //alert('Hey, Already added !')
    //sliders.pop(img);
    sliders.splice(item, 1)
    element.classList.remove('added');
    count++;
    showSliderItem(count);
  }
}
const showSliderItem = (length, value = count) => {
  const time = document.getElementById('duration').value;
  //document.getElementById("sliderTotal").innerText =`You selected total ${length} images in the slide show and deselected ${value} times. You put ${time} ms in duration field.`
  if (time < 1000) {
    document.getElementById("sliderTotal").innerText = `You selected total ${length} images in the slide show and deselected ${value} times. You put ${time} ms in duration field but its working on 1000 ms`
  }
  else {
    document.getElementById("sliderTotal").innerText = `You selected total ${length} images in the slide show and deselected ${value} times. You put ${time} ms in duration field.`
  }
}
var timer
const createSlider = () => {
  showSliderItem(sliders.length);
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value;
  if (duration > 1000) {
    slideShow();
  }
  else {
    duration = 1000;
    slideShow();
  }
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}
const slideShow = () => {
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100" onclick=removeSlider("${slide}") id="slider-item"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  })

}
// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}
// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };
  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }
  items.forEach(item => {
    item.style.display = "none"
  })
  items[index].style.display = "block"
}
search.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
  }
})
sliderBtn.addEventListener('click', function () {
  createSlider()
})
const toggleSpinner = (show) => {
  const spinner = document.getElementById("spinner");
  if (show) {
    spinner.classList.remove('d-none')
  }
  else {
    spinner.classList.add('d-none')
  }
}
const userInfo = () => {
  const sliderTotal = document.getElementById("sliderTotal");
  sliderTotal.classList.remove("d-none")
}