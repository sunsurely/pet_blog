document.addEventListener('DOMContentLoaded', function () {
  logincheck();
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

const getDetail = async (id) => {
  console.log(id);
  const result = await axios.get(`/api/posts/${id}`);
  const post = result.data;
  const mainBox = document.querySelector('.mainBox');
  mainBox.innerHTML = '';
  const temp = `
       <div class="postDetailBox">
           <h2>${post.title}</h2>
           <img src="${post.postImage}"/>
           <div class="content">
          <p>${post.content}</p>
          </div>
          <div class="comment">
          <img src='../images/reply.png'>
           </div>
        <div class="love">
          <img src='../images/heart.png'>
        </div>    
        <button class='detailBtn' onclick="getDelete(${id})">삭제</button>
        <button class='detailBtn' onclick="updatePost(${id})">수정</button>
       </div>`;
  mainBox.innerHTML = temp;
};

{
  /* <button onclick="location.href = 'index.html'">수정버튼</button> */
}
// {
//    <form method="post" action="/api/posts/${id}" class="deleteBtn">
//           <input type="hidden" name="_method" value="DELETE" />
//           <input type="submit" value="Delete"/>
//         </form>
// }

function openLoginModal() {
  let loginModal = $('.loginModal');
  let pannal = $('.pannal');
  pannal.show();
  loginModal.show();
}
function opensignUpModal() {
  let signUpModal = $('.signUpModal');
  let pannal = $('.pannal');
  pannal.show();
  signUpModal.show();
}

function closeModal() {
  let loginModal = $('.loginModal');
  let signUpModal = $('.signUpModal');
  let pannal = $('.pannal');
  pannal.hide();
  loginModal.hide();
  signUpModal.hide();
}

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
            <button class="loginBtn" onclick="openLoginModal()"></i>로그인</button>
          `;
  }
  topBar.innerHTML += temp;
}

async function updatePost(id) {
  const result = await axios.get(`/api/posts/${id}`);
  const post = result.data;
  const mainBox = document.querySelector('.mainBox');
  mainBox.innerHTML = '';
  const temp = `
        <form method="post" action="">
          <input type="hidden" name="_method" value="put">
          <input type="text" name="title" class="postTitle" placeholder="제목을 입력해주세요.">
          <textarea class="postTextArea" name="content" rows="45", cols="100"></textarea>
          <input type="file" name="image" class="addPostImage">
        </form>
        <button class="updateBtn">수정하기</button>`;
  mainBox.innerHTML = temp;
  const updateBtn = document.querySelector('.updateBtn');
  updateBtn.addEventListener('click', () => {
    console.log('asd');
    const title = document.querySelector('.postTitle').value;
    const content = document.querySelector('.postTextArea').value;
    const file = document.querySelector('.addPostImage').files[0];
    console.log('파일입니다: ' + file);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('content', content);

    axios
      .patch(`/api/posts/${id}`, formData)
      .then((response) => {
        console.log('업로드 성공');
      })
      .catch((error) => {
        console.error('업로드 실패: ' + error);
      });
    window.location.href = 'index.html';
  });
}

function selectData() {
  console.log('asd');
  const title = document.querySelector('.postTitle').value;
  const content = document.querySelector('.postTextArea').value;
  const file = document.querySelector('.addPostImage').value;
  console.log('파일입니다: ' + file);
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('content', content);

  axios
    .patch(`/api/posts/${id}`, formData)
    .then((response) => {
      console.log('업로드 성공');
    })
    .catch((error) => {
      console.error('업로드 실패: ' + error);
    });
  // return getPut(title, content, file);
}

function getDelete() {
  axios
    .delete(`/api/posts/${id}`)
    .then((response) => {
      alert(response);
    })
    .catch((error) => {
      alert(error);
    });
}

function getPut(title, content, image) {
  $.ajax({
    type: 'PUT',
    url: `/api/posts/${id}`,
    data: {
      title,
      content,
      image,
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert('로그인이 필요합니다.');
      } else {
        localStorage.clear();
        alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = 'index.html';
    },
  });
  window.location.href = 'index.html';
}

getDetail(id);

//

// // const updateBtn = document.querySelector('.updateBtn');

// // updateBtn.addEventListener('click', () => {
// //   const title = document.querySelector('.postTitle').value;
// //   const content = document.querySelector('.postTextArea').textContent;
// //   const file = document.querySelector('.addPostImage').file[0];

// //   const formData = new FormData();
// //   formData.append('image', file);
// //   formData.append('title', title);
// //   formData.append('content', content);

// //   axios
// //     .put(`/api/posts/${id}`, formData)
// //     .then((response) => {
// //       console.log('업로드 성공');
// //     })
// //     .catch((error) => {
// //       console.error('업로드 실패: ' + error);
// //     });
// // });

// function selectData2() {
//   const title = document.querySelector('.postTitle').value;
//   const content = document.querySelector('.postTextArea').textContent;
//   const file = document.querySelector('.addPostImage').file[0];

//   const formData = new FormData();
//   formData.append('image', file);
//   formData.append('title', title);
//   formData.append('content', content);

//   axios
//     .put(`/api/posts/${id}`, formData)
//     .then((response) => {
//       console.log('업로드 성공');
//     })
//     .catch((error) => {
//       console.error('업로드 실패: ' + error);
//     });
// }

// function selectData() {
//   console.log('가나다라');
//   const title = document.querySelector('.postTitle').value;
//   const content = document.querySelector('.postTextArea').textContent;
//   const file = document.querySelector('.addPostImage').file[0];
//   console.log('file:' + file);
//   return getPut(title, content, file);
// }

// function getDelete(callback) {
//   $.ajax({
//     type: 'DELETE',
//     url: `/api/posts/${id}`,
//     success: function (response) {
//       callback(response.user);
//     },
//     error: function (xhr, status, error) {
//       if (status == 401) {
//         alert('로그인이 필요합니다.');
//       } else {
//         localStorage.clear();
//         alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
//       }
//       window.location.href = 'index.html';
//     },
//   });
//   window.location.href = 'index.html';
// }

// function getPut(title, content, image) {
//   $.ajax({
//     type: 'PUT',
//     url: `/api/posts/${id}`,
//     data: {
//       title,
//       content,
//       image,
//     },
//     error: function (xhr, status, error) {
//       if (status == 401) {
//         alert('로그인이 필요합니다.');
//       } else {
//         localStorage.clear();
//         alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
//       }
//       window.location.href = 'index.html';
//     },
//   });
//   window.location.href = 'index.html';
// }

// getDetail(id);
