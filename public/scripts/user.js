document.addEventListener('DOMContentLoaded', function () {
  logincheck();
});

function openLoginModal() {
  let loginModal = $('.loginModal');
  let pannal = $('.pannal');
  pannal.show();
  loginModal.show();
}
function closeModal() {
  let loginModal = $('.loginModal');
  let signUpModal = $('.signUpModal');
  let pannal = $('.pannal');
  pannal.hide();
  loginModal.hide();
  signUpModal.hide();
}
function opensignUpModal() {
  let signUpModal = $('.signUpModal');
  let pannal = $('.pannal');
  pannal.show();
  signUpModal.show();
}
async function logout() {
  await axios
    .post(`/api/login/logout`)
    .then((response) => {
      alert('로그아웃 되었습니다.');
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
}

//로그인
const loginSubmit = document.querySelector('.loginSubmit');

loginSubmit.addEventListener('click', async (e) => {
  e.preventDefault();
  const nickname = document.querySelector('.nicknameText').value;
  const password = document.querySelector('.passwordText').value;
  const data = {
    nickname: nickname,
    password: password,
  };

  await axios
    .post('/api/login', data, {
      headers: {
        'Content-Type': 'application/json', // 전송할 데이터의 타입 지정
      },
    })
    .then((response) => {
      alert('로그인 되었습니다.');
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
});

//로그인 체크

function logincheck() {
  const checkToken = document.cookie.split('=')[1];
  const topBar = document.querySelector('.signBox');
  let temp = ``;
  if (checkToken) {
    temp = `
    <button class="logoutBtn" onclick="location.href='write.html'"></i>글쓰기</button>
            <button class="logoutBtn goProfile" onclick="location.href='profiles.html'">프로필</button>
            <form action="/api/login/logout" method="post">
              <button class="logoutBtn"></i>로그아웃</button>
            </form>
          `;
  } else {
    temp = `
         
           <button class="signUpBtn" onclick="opensignUpModal()">회원가입</button>
            <button class="loginBtn" onclick="openLoginModal()">로그인</button>
          
          `;
  }
  topBar.innerHTML += temp;
}

//로그인 체크
