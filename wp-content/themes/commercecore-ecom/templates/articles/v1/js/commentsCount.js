window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.like-button').forEach(function(button) {
        button.addEventListener('click', function() {
            let likesCountElement = this.parentNode.querySelector('.likes-count');
            let likesCount = parseInt(likesCountElement.textContent);
            if (this.textContent == 'Like') {
                this.textContent = 'Unlike';
                likesCount += 1;
            } else {
                this.textContent = 'Like';
                likesCount -= 1;
            }
            likesCountElement.textContent = likesCount.toString();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const newPostInput = document.querySelector('#newPostInput');
    const newPostArea = document.querySelector('#newPostArea');
    const newPostButton = document.querySelector('#newPostButton');
    const commentsContainer = document.getElementById('comment-section'); // This is the parent container of all comments

    newPostInput.addEventListener('focus', function() {
        newPostArea.style.display = 'block';
    });

    newPostButton.addEventListener('click', function() {
        const newCommentText = newPostInput.value;
        if (newCommentText) {
            const newComment = document.createElement('div');
            newComment.classList.add('comment-section');
            newComment.innerHTML = `
                <div class="comment">
                  <img src="${acfData.buyer_profile_picture}" alt="New User's profile picture" width="30" class="profile-picture" style="border: none !important;">
                  <div class="section">
                    <div class="name-location">
                      <div class="username">Guest</div>
                      <div class="user_location"></div>
                    </div>
                    <div>
                      <p class="comment-text">${newCommentText}</p>
                    </div>
                    <div class="action-buttons">
                      <button class="facebook-button like-button mr-2">${acfData.comment_section_button_title.like_button}</button>
                      <button class="facebook-button mr-2">${acfData.comment_section_button_title.reply_button}</button>
                      <div class="flex items-center">
                        <img src="${acfData.theme_link}/templates/articles/v1/assets/img/cmntz/likeicon.png" alt="Like icon" class="like-icon border-none mr-2" loading="lazy" decoding="async">
                        <span class="facebook-button mr-2">0</span>
                      </div>
                      <span class="user_location">Just now</span>
                    </div>
                  </div>
                </div>
            `;
            commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
            newPostInput.value = '';
            onCommentUpdate();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const newPostInput = document.querySelector('#newPostInput');
    const newPostArea = document.querySelector('#newPostArea');
    const newPostButton = document.querySelector('#newPostButton');
    const commentsContainer = document.querySelector('.comment-section');

    newPostInput.addEventListener('focus', function() {
        newPostArea.style.display = 'block';
    });

    newPostButton.addEventListener('click', function() {
        createComment(newPostInput.value, commentsContainer, true);
        newPostInput.value = '';
    });

    // Adding an input field to reply to a existing comment when pressed on reply button
    document.querySelectorAll('.reply-button').forEach((button) => {
        button.addEventListener('click', function() {
            const parent = this.closest('.comment-section');
            const replyArea = parent.querySelector('.reply-area');
            if (!replyArea) {
                const replyArea = document.createElement('div');
                replyArea.classList.add('reply-area');
                replyArea.innerHTML = `
        <table class="reply-table" >
          <tbody>
            <tr>
              <td class="reply-profile-pic border-none">
                <img class="lazy" src="${acfData.buyer_profile_picture}"
                      alt="Facebook default profile picture" width="48" loading="lazy" decoding="async">
              </td>
              <td class="replyStyleInput">
                <input id="newReplyInput" type="text" placeholder="${acfData.tr_placeholder}">
                <div id="newPostArea" style="background:#F6F7F9; height:40px; width:100%;">
                  <img class="lazy reply-post-btn border-none" src="${acfData.theme_link}/templates/articles/v1/assets/img/cmntz/reply.svg" alt="Facebook post button with blue background and white font" style="cursor:pointer; float: right; margin-bottom:-10px; margin-right:10px;" loading="lazy" decoding="async">
                	<img class="lazy newCancelButton border-none" src="${acfData.theme_link}/templates/articles/v1/assets/img/cmntz/cancel.svg" alt="Facebook cancel button in white background and black font" style="height: cursor:pointer; float: right; margin-bottom:-10px; margin-right:5px;" loading="lazy" decoding="async">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `;
                parent.appendChild(replyArea);
                replyArea.querySelector('.reply-post-btn').addEventListener('click', function() {
                    createComment(replyArea.querySelector('#newReplyInput').value, parent);
                    parent.removeChild(replyArea);
                    onCommentUpdate(); // Update comment count
                });
                replyArea.querySelector('.newCancelButton').addEventListener('click', function() {
                    parent.removeChild(replyArea);
                });
            }
        });
    });

    // Adding a subcomment
    function createComment(text, parent, isNewComment = false) {
        if (text) {
            const newComment = document.createElement('div');
            newComment.classList.add('comment-section');
            newComment.innerHTML = `
        <div class="subcomment">
          <img src="${acfData.buyer_profile_picture}" alt="New User's profile picture" width="30" class="profile-picture-reply border-none" loading="lazy" decoding="async">
          <div class="section">
            <div class="name-location">
              <div class="username">Guest</div>
              <div class="user_location"></div>
            </div>
            <div>
              <p class="comment-text">${text}</p>
            </div>
            <div class="action-buttons">
              <button class="facebook-button like-button mr-2">Like</button>
			  
              <button class="facebook-button reply-button mr-2">Reply</button>
              <div class="flex items-center">
                <img src="${acfData.theme_link}/templates/articles/v1/assets/img/cmntz/likeicon.png" alt="Like icon" class="like-icon mr-2" loading="lazy" decoding="async">
                <span class="facebook-button mr-2">0</span>
              </div>
              <span class="user_location">Just now</span>
            </div>
          </div>
        </div>
      `;
            if (isNewComment) {
                commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
            } else {
                parent.appendChild(newComment);
            }
        }
    }
});

// Counting comments function
window.addEventListener('DOMContentLoaded', (event) => {
    updateCommentCount();
});

function updateCommentCount() {
    const commentCount = document.querySelectorAll('.comment-section').length;
    document.querySelector('#comment-count').textContent = commentCount + '   ' + acfData.tr_comments_count;
}

// Call this function every time a comment is added
function onCommentUpdate() {
    updateCommentCount();
}