// document.addEventListener('DOMContentLoaded', function () {
//   logincheck();
// });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

const getDetail = async (id) => {
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
  
  </div>
  <div class="love">
  <img class='likeButton' onclick='likeChange(this.src)' src='../images/heart.png'>
  </div>
  <div class="comment" onclick="commentOnOff()">
  <img src='../images/reply.png'>
  </div>
  <button class='deleteBtn' onclick="getDelete(${id})">삭제</button>
  <button class='deleteBtn' onclick="updatePost(${id})">수정</button>
  </div>`;
  mainBox.innerHTML = temp;
};

function likeChange(src) {
  const like = document.querySelector('.likeButton');
  const urls = [
    'http://localhost:3000/images/heart.png',
    'http://localhost:3000/images/heart2.png',
  ];
  if (src === urls[0]) {
    like.src = urls[1];
  } else {
    like.src = urls[0];
  }
}
const getComment = async (id) => {
  const { data } = await axios.get(`/api/comments/posts/${id}/comments`);
  const comments = data.data;
  const showCommentBox = document.querySelector('.showCommentBox');
  showCommentBox.innerHTML = '';
  comments.forEach((item) => {
    const temp = `<div class="commentlist">
                  <h4>${item.comment}</h4>
                  <p>${item.User.nickname}</p>
                  <p>${item.createdAt}</p>
                  <p>${item.updatedAt}</p>
                  <div class="commentId${item.commentId}"></div>
                  <button onclick="updateCommentOpen(${item.commentId})" class="updateBtn${item.commentId}">수정하기</button>
                  <button onclick="deleteComment(${item.commentId})" class="deleteBtn${item.commentId}">삭제하기</button>
                </div>`;
    showCommentBox.innerHTML += temp;
  });
};

const commentOnOff = () => {
  const commentBox = document.querySelector('.commentBox');
  if (commentBox.style.display == 'block') {
    commentBox.style.display = 'none';
  } else {
    commentBox.style.display = 'block';
  }
};

const updateCommentOpen = async (commentid) => {
  const commentSelect = document.querySelector(`.commentId${commentid}`);
  const updateBtn = document.querySelector(`.updateBtn${commentid}`);
  const deleteBtn = document.querySelector(`.deleteBtn${commentid}`);
  await axios
    .post(`/api/comments/posts/${id}/comments/${commentid}`, {})
    .then((response) => {
      commentSelect.innerHTML = '';
      const temp = `<div class="allUpdateInputContent">
                      <textarea id="commentUpdateContent"class="commentUpdateContent${commentid}"  maxlength="15"></textarea>
                      <button class="commentBtn" type="button" onclick="updateComment(${commentid})">
                        수정하기
                      </button>
                  </div>`;
      commentSelect.innerHTML += temp;
      updateBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
};

const updateComment = async (commentid) => {
  const comment = document.querySelector(
    `.commentUpdateContent${commentid}`,
  ).value;
  await axios
    .put(`/api/comments/posts/${id}/comments/${commentid}`, {
      comment: comment,
    })
    .then((response) => {
      console.log('수정이 완료되었습니다.');
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
};

const deleteComment = async (commentid) => {
  await axios
    .delete(`/api/comments/posts/${id}/comments/${commentid}`)
    .then((response) => {
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
};

async function updatePost(id) {
  const loginCheck = localStorage.getItem('isLoggedIn');
  const checkToken = document.cookie.split('=')[1];
  console.log(loginCheck);
  if (!checkToken) {
    openLoginModal();
  } else {
    const mainBox = document.querySelector('.mainBox');
    mainBox.innerHTML = '';
    const temp = `
        <div class="postDetailBox">
          <form method="post" action="">
            <input type="hidden" name="_method" value="put">
            <input type="text" name="title" class="postTitle" placeholder="제목을 입력해주세요.">
            <textarea class="postTextArea" name="content" rows="35", cols="70"></textarea>
            <input type="file" name="image" class="addPostImage">
          </form>
          <button class="updateBtn">수정하기</button>
        </div>`;
    mainBox.innerHTML = temp;
    const updateBtn = document.querySelector('.updateBtn');
    updateBtn.addEventListener('click', async () => {
      const title = document.querySelector('.postTitle').value;
      const content = document.querySelector('.postTextArea').value;
      const file = document.querySelector('.addPostImage').files[0];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('content', content);

      await axios
        .patch(`/api/posts/${id}`, formData)
        .then((response) => {
          console.log('업로드 성공');
          location.reload();
        })
        .catch((error) => {
          alert(error.response.data.errorMessage);
          location.reload();
        });
    });
  }
}

async function getDelete() {
  await axios
    .delete(`/api/posts/${id}`)
    .then((response) => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
}

async function postComment() {
  const comment = document.querySelector('.commentContent').value;

  await axios
    .post(`/api/comments/posts/${id}/comments`, { comment: comment })
    .then((response) => {
      console.log('댓글저장성공');
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      location.reload();
    });
}

function openLoginModal() {
  const loginModal = $('.loginModal');
  const pannal = $('.pannal');
  pannal.show();
  loginModal.show();
}
getDetail(id);
getComment(id);

function closeModal() {
  let loginModal = $('.loginModal');
  let signUpModal = $('.signUpModal');
  let pannal = $('.pannal');
  pannal.hide();
  loginModal.hide();
  signUpModal.hide();
}

const loginSubmit = document.querySelector('.loginSubmit');
console.log(loginSubmit);

loginSubmit.addEventListener('click', async (e) => {
  e.preventDefault();
  const nickname = document.querySelector('.nicknameText').value;
  console.log(nickname);
  const password = document.querySelector('.passwordText').value;
  console.log(password);
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
      localStorage.setItem('isLoggedIn', true);
      alert('로그인 되었습니다.');
      location.reload();
    })
    .catch((error) => {
      alert(error);
    });
});
