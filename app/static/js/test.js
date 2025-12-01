document.getElementById('input-btn').addEventListener('click', () => {
    const inputText = document.getElementById('input-text').value
    var commentList = document.getElementById('commentList');

    let newDiv = document.createElement('div');
    newDiv.innerHTML = inputText;

    commentList.appendChild(newDiv)
})