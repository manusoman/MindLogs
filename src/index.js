const copyright = document.getElementById('copyright');

async function putCopyRight() {
    let year;

    try {
        const data = await fetch('https://manusoman.github.io/MindLogs/settings.json').then(res => res.json());
        year = data.current_year;
    } catch(err) {
        year = new Date().getFullYear();
        console.error(err);
    }

    copyright.innerHTML = `Manu Soman © ${ year }`;
}

putCopyRight();