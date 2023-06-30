const modBtn = document.querySelector('.modBtn');
const modified = document.querySelector('#modified');

modBtn.addEventListener('click', () => {
  const imgForm = document.querySelector('.setImageBtn');
  imgForm.style.display = 'block';
  modBtn.style.display = 'none';
});

modified.addEventListener('click');
