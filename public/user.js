document.addEventListener('DOMContentLoaded', function () {
  // initMain(); //첫 메인페이지 접속시 조회화면
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

// // 최초 접속시 조회화면
// const initMain = async () => {
//   const cardBody = document.querySelector('.postBox');
//   cardBody.innerHTML = '';
//   const { data } = await axios.get('/api/posts');
//   console.log(data);

//   data.forEach((item) => {
//     const temp = `
//       <div class="postBox">
//       <p
//       </div>
//     `;
//   });
// };
