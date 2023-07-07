// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

const BASE_URL = 'http://localhost:3000';
const TOYS_URL = `${BASE_URL}/toys`;

const toyForm = document.querySelector('#toy-form');
const toyCollection = document.querySelector('#toy-collection');

// Function to fetch toys from the API
function fetchToys() {
  fetch(TOYS_URL)
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        renderToyCard(toy);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// Function to create a toy card
function renderToyCard(toy) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
  `;

  // Add event listener to toy's like button
  const likeBtn = card.querySelector('.like-btn');
  likeBtn.addEventListener('click', () => {
    increaseLikes(toy);
  });

  toyCollection.appendChild(card);
}

// Function to add a new toy
function addNewToy(event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const image = document.querySelector('#image').value;
  const likes = 0;

  const newToy = {
    name: name,
    image: image,
    likes: likes,
  };

  fetch(TOYS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(newToy),
  })
    .then((response) => response.json())
    .then((toy) => {
      renderToyCard(toy);
      toyForm.reset();
    })
    .catch((error) => {
      console.log(error);
    });
}

// Function to increase a toy's likes
function increaseLikes(toy) {
  const updatedLikes = toy.likes + 1;

  fetch(`${TOYS_URL}/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      likes: updatedLikes,
    }),
  })
    .then((response) => response.json())
    .then((updatedToy) => {
      const card = document.querySelector(`.card[data-id="${updatedToy.id}"]`);
      const likesText = card.querySelector('p');
      likesText.textContent = `${updatedToy.likes} Likes`;
    })
    .catch((error) => {
      console.log(error);
    });
}

// Event listeners
toyForm.addEventListener('submit', addNewToy);

// Fetch toys on page load
fetchToys();
