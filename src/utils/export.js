function download(res) {
    if (!data) return;
    let blob = new Blob([data], { type: 'application/octet-stream;charset=UTF-8' });
    let contentDisposition = res.headers['content-disposition']

    let url = window.URL.createObjectURL(blob);
    let aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = url;
    aLink.setAttribute("download", fileName);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
    window.URL.revokeObjectURL(url);
}

export { download }
