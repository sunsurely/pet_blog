document.addEventListener('DOMContentLoaded', function () {
  profileImage();
});

const modBtn = document.querySelector('.modBtn');
const modified = document.querySelector('#modified');
const myComment = document.querySelector('.myComment');
modBtn.addEventListener('click', () => {
  const imgForm = document.querySelector('.setImageBtn');
  imgForm.style.display = 'block';
  modified.style.display = 'block';
  modBtn.style.display = 'none';
  myComment.innerHTML = ``;
  myComment.style.background = 'none';
  myComment.innerHTML = `<textarea class="inputComment"></textarea>`;
});

modified.addEventListener('click', async () => {
  const file = document.querySelector('.modFile').files[0];
  const userComment = document.querySelector('.inputComment').value;
  console.log(userComment);
  const password = prompt('비밀번호를 입력하세요');
  console.log(file);
  const formData = new FormData();
  if (file) {
    formData.append('image', file);
  }
  formData.append('password', password);
  formData.append('userComment', userComment);
  console.log(userComment);

  await axios
    .patch('/api/users/profile', formData)
    .then((response) => {
      alert('파일 업로드 성공');
    })
    .catch((error) => {
      alert(error);
    });
  location.reload();
});

const profileImage = async () => {
  const result = await axios.get('/api/users/profile');
  const nickname = document.querySelector('.nickname');
  const profile = result.data.data;
  const profileImage = document.querySelector('.myImage');
  const myComment = document.querySelector('.myComment');

  nickname.innerText = profile.Nickname;

  if (profile.userImage) profileImage.setAttribute('src', profile.userImage);
  if (profile.userComment) {
    myComment.innerText = `${profile.userComment}`;
  }
};

const topBar = document.querySelector('.topBar');
topBar.addEventListener('click', () => {
  location.href = '/';
});
