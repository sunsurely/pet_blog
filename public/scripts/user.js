document.addEventListener('DOMContentLoaded', function () {
  initMain(); //첫 메인페이지 접속시 조회화면
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
function logout() {
  axios
    .post(`/api/login/logout`)
    .then((response) => {
      alert('로그아웃 되었습니다.');
    })
    .catch((error) => {
      console.error('로그아웃 실패: ' + error);
    });
}

// 최초 접속시 조회화면
const initMain = async () => {
  const cardBody = document.querySelector('.body');
  cardBody.innerHTML = ``;
  const { data } = await axios.get('/api/posts');
  const results = data.data;

  results.forEach((item) => {
    const temp = `
      <div id="${item.postId}"  class="postBox">
      <img class="post-image" src="${item.postImage}"/>
      </div>
    `;
    cardBody.innerHTML += temp;
  });

  const postBox = document.querySelectorAll('.postBox');
  postBox.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('id');
      window.location.href = `/detail.html?id=${id}`;
      console.log(id);
    });
  });
};

//로그인 체크

function logincheck() {
  const checkToken = document.cookie.split('=')[1];
  const topBar = document.querySelector('.signBox');
  console.log(checkToken);
  let temp = ``;
  if (checkToken) {
    temp = `
    <button class="logoutBtn" onclick="location.href='write.html'"></i>글쓰기</button>
            <button class="logoutBtn" onclick="location.href='profiles.html'"></i>프로필</button>
            <button class="logoutBtn" onclick="logout()"></i>로그아웃</button>
          `;
  } else {
    temp = `<button class="signUpBtn" onclick="opensignUpModal()">회원가입</button>
            <button class="loginBtn" onclick="openLoginModal()">로그인</button>
          `;
  }
  topBar.innerHTML += temp;
}

const mainHome = document.querySelector('.topBar');
mainHome.addEventListener('click', () => {});
