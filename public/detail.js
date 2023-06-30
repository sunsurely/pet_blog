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
        <div class="love">
            <i class="fi fi-rr-heart" id="emptyHeartIcon"></i>
            <!-- 색깔하트출력안되는중..원인불명 -->
            <!-- <i class="fi fi-sr-heart"></i> -->
            <p>좋아요</p>
        </div>
        <div class="comment">
            <i class="fi fi-rr-comment-alt" id="commentIcon"></i>
            <p>댓글</p>
         </div>
        <button onclick="getDelete(${id})">삭제버튼</button>
        <button onclick="updatePost(${id})">수정버튼</button>
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
