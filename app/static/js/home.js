async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status && data.posts) {
            displayPosts(data.posts);
        } else {
            throw new Error('');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Không thể tải bài viết. Vui lòng thử lại sau.');
    }
}

function displayPosts(posts) {
    const postGridElement = document.getElementById('posts-grid');

    if (posts.length === 0) {
        postGridElement.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <h4>📝 Chưa có bài viết nào</h4>
                    <p>Hãy quay lại sau khi có bài viết mới nhé!</p>
                </div>
            </div>
        `;
        return;
    }

    const postsHTML = posts.map(post => `
        <div class="col-md-6 col-lg-4">
            <div class="card post-card h-100">
                <div class="card-header bg-transparent border-0 pt-3">
                    <div class="d-flex align-items-center">
                        <img src="${post.avatar_url}" 
                             alt="Avatar của ${post.author}" 
                             class="avatar me-3"
                             onerror="this.src='static/avatars/default.png'">
                        <div>
                            <h6 class="mb-0 fw-bold">${post.author}</h6>
                            <small class="text-muted">${formatDate(post.created_at)}</small>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-primary">${post.post_title}</h5>
                    <p class="card-text post-content">${post.content}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <button id="${post.post_id}" class="btn btn-outline-primary btn-sm view-detailPost-btn">
                            Đọc thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    postGridElement.innerHTML = postsHTML;
}

function showError(message) {
    const postGridElement = document.getElementById('posts-grid');
    postGridElement.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                <h4>⚠️ Lỗi</h4>
                <p>${message}</p>
                <button class="btn btn-primary mt-2" onclick="fetchPosts()">Thử lại</button>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return 'Chưa xác định';

    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function viewPost(postId) {
    window.location.href = `/post/${postId}`;
}

document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('view-detailPost-btn')) {
        viewPost(event.target.id);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    fetchPosts();

    document.getElementById('change-option-btn').addEventListener('click', (e) => {
        var cspOpotin = document.getElementById('csp-select-options').value;

        if (cspOpotin === 'on') {
            fetch('/api/csp/on', { method: 'POST' })
        } else {
            fetch('/api/csp/off', { method: 'POST' })
        }
    })
});