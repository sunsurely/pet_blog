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
       </div>`;

  mainBox.innerHTML = temp;
};

getDetail(id);
