
function getCommentIdFromURL() {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');

    for (let segment of pathSegments) {
        const postIndex = pathSegments.indexOf('comment');
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

async function fetchComment() {
    comment_id = getCommentIdFromURL();
    if (!comment_id) {
        alert('Cannot get comment_id');
    }
    const response = await fetch(`/api/comment/${comment_id}`)
    if (response) {
        const data = await response.json()
        if (data.status) {
            displayComment(data);
        } else {
            console.log('Cannot load comment data')
        }
    }
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


function displayComment(commentData) {
    document.getElementById('post-id').textContent = commentData.post_id;
    document.getElementById('commentor').textContent = commentData.commentor;
    document.getElementById('title').textContent = commentData.title;
    document.getElementById('content').textContent = commentData.content;
    document.getElementById('star').textContent = displayStars(commentData.star) + ` (${commentData.star}/5)`;
    document.getElementById('created-at').textContent = formatDate(commentData.created_at);
}

function goBack() {
    window.location.href = '/home'
}

function editComment() {
    alert("Chuyển đến trang chỉnh sửa comment");
}

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    fetchComment();
})


