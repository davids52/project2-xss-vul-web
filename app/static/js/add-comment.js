function getPostIdFromURL() {
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

async function updateComment() {
    const postId = getPostIdFromURL();

    const formElement = document.getElementById('commentForm');
    const formData = new FormData(formElement);

    const response = await fetch(`/api/comment/add/${postId}`, {
        method: 'POST',
        body: formData
    })

    if (response) {
        const data = await response.json()
        if (data.status) {
            console.log(data.message)
            window.location.href = `/post/${postId}`;
        } else {
            console.log(data.message)
        }
    }

}

document.getElementById('commentForm').addEventListener('submit', (e) => {
    e.preventDefault()
    updateComment();
})