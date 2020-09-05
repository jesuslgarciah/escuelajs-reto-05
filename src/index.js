const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const final = document.getElementById('final')
const API = 'https://rickandmortyapi.com/api/character/';

document.addEventListener("visibilitychange", async () => {
  if(document.visibilityState !== "visible"){
    $app.innerHTML = ""
    localStorage.clear()
    final.style.display = "none"
  }else{
    intersectionObserver.observe($observe);
  }
})

const getData = api => {
  if (localStorage.getItem('next_fetch') !== null){
    api = localStorage.getItem('next_fetch')
  }
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const nextPage = response.info.next;
      const characters = response.results;
      let output = characters.map(character => {
        return `
          <article class="Card">
            <img src="${character.image}" />
            <h2>${character.name}<span>${character.species}</span></h2>
          </article>`
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
      localStorage.setItem('next_fetch', nextPage)
      if(nextPage === null){
        intersectionObserver.disconnect()
        final.style.display = "block"
      }
    })
    .catch(error => console.log(error));
}

const loadData = async () => {
  try{
    await getData(API);
  }catch(err){
    console.error(err)
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);