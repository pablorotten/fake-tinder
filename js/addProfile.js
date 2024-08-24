document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('like2').addEventListener('click', () => {
    const form = document.getElementById('addProfileForm');
    if (form.style.display === 'block') {
      form.style.display = 'none';
    } else {
      form.style.display = 'block';
    }
  });
});

document.getElementById('submitProfileBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('profileImage');
  const nameInput = document.getElementById('profileName');
  const ageInput = document.getElementById('profileAge');
  const distanceInput = document.getElementById('profileDistance');

  if (fileInput.files.length === 0 || !nameInput.value || !ageInput.value || !distanceInput.value) {
    alert('Please fill in all fields');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const newProfile = {
      img: event.target.result,
      name: nameInput.value,
      age: ageInput.value,
      distance: distanceInput.value
    };

    profiles.unshift(newProfile);
    appendCard(newProfile);

    document.getElementById('addProfileForm').style.display = 'none';
    fileInput.value = '';
    nameInput.value = '';
    ageInput.value = '';
    distanceInput.value = '';
  };

  reader.readAsDataURL(fileInput.files[0]);
});