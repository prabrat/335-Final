async function createPlaylist() {
    const name = prompt("Enter playlist name:");
    if (!name) return;

    const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });

    const data = await res.json();
    alert("Created playlist: " + data.name);
}

async function addMovieToPlaylist(playlistId, movie) {
    await fetch(`/api/playlists/${playlistId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
    });

    alert("Movie added!");
}
