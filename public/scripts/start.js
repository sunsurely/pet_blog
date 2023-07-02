document.addEventListener('DOMContentLoaded', function () {
  initMain(); //첫 메인페이지 접속시 조회화면
});

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
        <p>${item.title}</p>
        </div>
      `;
    cardBody.innerHTML += temp;
  });

  const postBox = document.querySelectorAll('.postBox');
  postBox.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('id');
      window.location.href = `/detail.html?id=${id}`;
    });
  });
};
