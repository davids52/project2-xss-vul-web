document.getElementById('get-url').addEventListener('submit', (e) => {
    e.preventDefault();

    const formElement = document.getElementById('get-url')
    const formData = new FormData(formElement);

    const url = formData.get('url') || '';
    document.write("You'are prepared to href to new url" + url + "\nPlease wait a minute...");

    window.location.href = url;
})