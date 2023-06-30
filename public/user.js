document.addEventListener('DOMContentLoaded', function () {
  initMain(); //첫 메인페이지 접속시 조회화면
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

// 최초 접속시 조회화면
const initMain = async () => {
  const cardBody = document.querySelector('.body');
  cardBody.innerHTML = '';
  const { data } = await axios.get('/api/posts');
  const results = data.data;

  results.forEach((item) => {
    const temp = `
      <div id="${item.postId}"  class="postBox">
      <img class="post-image" src="${item.postImage}"/>
      <p>${item.title}</p>
      <p>${item.content}</p>
      <p>${item.createdAt}</p>
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

//카드 상세조회
