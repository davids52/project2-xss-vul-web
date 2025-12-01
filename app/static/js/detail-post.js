// Lấy post_id từ URL path (dạng /post/1)
function getPostIdFromURL() {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');

    for (let segment of pathSegments) {
        const postIndex = pathSegments.indexOf('post');
        if (postIndex !== -1 && pathSegments[postIndex + 1] === segment && !isNaN(segment)) {
            return segment;
        }
    }

    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && !isNaN(lastSegment)) {
        return lastSegment;
    }

    return null;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('vi-VN', options);
}

function displayStars(count) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < count) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

function displayPost(postData) {

    document.getElementById('loadingSpinner').classList.add('d-none');
    document.getElementById('postContent').classList.remove('d-none');

    document.getElementById('authorAvatar').src = `/${postData.avatar_url}`;
    document.getElementById('authorName').textContent = postData.author;
    document.getElementById('postDate').textContent = formatDate(postData.created_at);
    document.getElementById('postTitle').textContent = postData.post_title;
    document.getElementById('postContentText').textContent = postData.content;

    displayComments(postData.comments);

    setupCommentButtons();
}

function setupCommentButtons() {
    const postId = getPostIdFromURL();

    const writeCommentBtn = document.getElementById('writeCommentBtn');
    if (writeCommentBtn) {
        writeCommentBtn.addEventListener('click', function () {
            window.location.href = `/add/comment/${postId}`;
        });
    }

    const writeCommentBtnEmpty = document.getElementById('writeCommentBtnEmpty');
    if (writeCommentBtnEmpty) {
        writeCommentBtnEmpty.addEventListener('click', function () {
            window.location.href = `/add/comment/${postId}`;
        });
    }
}

function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    const noComments = document.getElementById('noComments');
    const commentsCount = document.getElementById('commentsCount');

    const commentsLength = comments ? comments.length : 0;
    commentsCount.textContent = commentsLength;

    if (!comments || commentsLength === 0) {
        noComments.classList.remove('d-none');
        commentsList.innerHTML = '';
        return;
    }

    noComments.classList.add('d-none');

    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-card card mb-3 fade-in';

    commentDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="comment-author mb-0">${comment.commentor || 'Ẩn danh'}</h5>
                <small class="comment-date text-muted">${formatDate(comment.created_at)}</small>
            </div>
            <div class="star-rating mb-2">
                ${displayStars(comment.star || 0)}
                <span class="ms-2 text-muted">(${comment.star || 0}/5)</span>
            </div>
            <h6 class="comment-title text-primary">${comment.title || 'Không có tiêu đề'}</h6>
            <p class="comment-content mt-2">${comment.content || 'Không có nội dung'}</p>
            <div  class="comment-footer mt-3">
                <button id="${comment.comment_id}" class="btn btn-outline-primary btn-sm view-detail-btn">
                    <i class="fas fa-eye"></i> Xem chi tiết
                </button>
            </div>
        </div>
    `;

    return commentDiv;
}

function viewCommentDetail(commentId) {
    window.location.href = `/comment/${commentId}`;
}

async function fetchPostData(postId) {
    try {
        const response = await fetch(`/api/post/${postId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const postData = await response.json();

        if (postData.status) {
            displayPost(postData);
        } else {
            throw new Error('Bài viết không tồn tại hoặc đã bị xóa');
        }
    } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
        showError(error.message);
    }
}

function showError(message) {
    document.getElementById('loadingSpinner').classList.add('d-none');
    document.getElementById('errorMessage').classList.remove('d-none');
    document.getElementById('errorText').textContent = message;
}

document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('view-detail-btn')) {
        const commentId = event.target.id;
        viewCommentDetail(commentId);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const postId = getPostIdFromURL();

    if (postId) {
        fetchPostData(postId);
    } else {
        showError('Không tìm thấy ID bài viết trong URL');
    }
});