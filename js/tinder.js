// js/tinder.js
let imgCount = 0
const appLink = 'pablorotten.github.io/fake-tinder'
const frame = document.body.querySelector('.frame')
let profiles = []
let current, likeText

document.addEventListener('DOMContentLoaded', () => {
  const likeIcon = document.getElementById('like');
  const modal = document.getElementById('myModal');
  const span = document.getElementsByClassName('close')[0];
  const form = document.getElementById('profileForm');
  let longPressTimer;

  likeIcon.addEventListener('pointerdown', () => {
    longPressTimer = setTimeout(() => {
      modal.style.display = 'block';
    }, 500); // 500ms for long press
  });

  likeIcon.addEventListener('pointerup', () => {
    clearTimeout(longPressTimer);
  });

  likeIcon.addEventListener('pointerleave', () => {
    clearTimeout(longPressTimer);
  });

  span.onclick = () => {
    modal.style.display = 'none';
  }

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  form.onsubmit = (event) => {
    event.preventDefault();
    const img = URL.createObjectURL(document.getElementById('profileImage').files[0]);
    const name = document.getElementById('profileName').value;
    const age = document.getElementById('profileAge').value;
    const distance = document.getElementById('profileDistance').value;

    const newProfile = { img, name, age, distance };
    profiles.unshift(newProfile);
    appendCard(newProfile);
    modal.style.display = 'none';
  }
});

fetch('js/profiles.json')
  .then(response => response.json())
  .then(data => {
    profiles = data
    profiles.forEach(profile => appendCard(profile))
    current = frame.querySelector('.card:last-child')
    likeText = current.children[0]
    initCard(current)

    document.querySelector('#like').onclick = () => {
      moveX = 1
      moveY = 0
      complete()
    }
    document.querySelector('#hate').onclick = () => {
      moveX = -1
      moveY = 0
      complete()
    }
    document.querySelector('#link').onclick = () => {
      $.notify("Link copied in the clipboard", "success");
      navigator.clipboard.writeText(`https://${appLink}`);
    }
  })

function appendCard(profile) {
  const firstCard = frame.children[0]
  const newCard = document.createElement('div')
  newCard.className = 'card'
  newCard.style.backgroundImage = `url(${profile.img})`
  newCard.innerHTML = `
    <div class="is-like">LIKE</div>
    <div class="bottom">
      <div class="title">
        ${profile.name === 'link' ? `<span><a href="javascript:void(0)" id="link" class="link">${appLink}<span></a>` : `<span>${profile.name}</span><span>${profile.age}</span>`}
      </div>
      <div class="info">
        ${profile.name !== 'link' ? `${profile.distance} miles away` : ``}
      </div>
    </div>
        `
  if (firstCard) frame.insertBefore(newCard, firstCard)
  else frame.appendChild(newCard)
  imgCount++
}

function initCard(card) {
  card.addEventListener('pointerdown', onPointerDown)
}

function setTransform(x, y, deg, duration) {
  current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
  likeText.style.opacity = Math.abs((x / innerWidth * 2.1))
  likeText.className = `is-like ${x > 0 ? 'like' : 'nope'}`
  if (duration) current.style.transition = `transform ${duration}ms`
}

function onPointerDown({clientX, clientY}) {
  startX = clientX
  startY = clientY
  current.addEventListener('pointermove', onPointerMove)
  current.addEventListener('pointerup', onPointerUp)
  current.addEventListener('pointerleave', onPointerUp)
}

function onPointerMove({clientX, clientY}) {
  moveX = clientX - startX
  moveY = clientY - startY
  setTransform(moveX, moveY, moveX / innerWidth * 50)
}

function onPointerUp() {
  current.removeEventListener('pointermove', onPointerMove)
  current.removeEventListener('pointerup', onPointerUp)
  current.removeEventListener('pointerleave', onPointerUp)
  if (Math.abs(moveX) > frame.clientWidth / 2) {
    current.removeEventListener('pointerdown', onPointerDown)
    complete()
  } else cancel()
}

function complete() {
  const flyX = (Math.abs(moveX) / moveX) * innerWidth * 1.3
  const flyY = (moveY / moveX) * flyX
  setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth)

  const prev = current
  const next = current.previousElementSibling
  if (next) {
    initCard(next)
    current = next
    likeText = current.children[0]
  }
  appendCard(profiles[imgCount % profiles.length])
  setTimeout(() => frame.removeChild(prev), innerWidth)
}

function cancel() {
  setTransform(0, 0, 0, 100)
  setTimeout(() => current.style.transition = '', 100)
}