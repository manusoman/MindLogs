const fs = require('fs');

const labels = ['title:', 'tags:', 'publish:', 'readLength:', 'h1:', 'h2:', 'h3:', 'h4:',
                'p:', 'code:', '----:'],
    folders = [
        `I-cant-Promise-but-Probably-should-work`
    ];

    
function init() {
    let i = folders.length;

    fs.readFile(`./article_template.html`, 'utf8', (err, template_data) => {
        if(err) throw err;

        while(i--) {
            const path = `./${folders[i]}`;
        
            fs.readFile(`${path}/content.txt`, 'utf8', (err, data) => {
                if(err) throw err;
                let fileData = parseContent(template_data, data, path);
                writeHTML(fileData, path);
            });
        }
    });
}


function parseContent(template_data, data) {
    const sections = data.split('>>>');
    let len = sections.length,
        body = '';

    for(let i = 0; i < len; i++) {
        const blocks = sections[i].split(':::');
        let l = blocks.length;

        switch(blocks[0]) {
            case 'title':
                template_data = template_data.replace(/{{title}}/g, blocks[l - 1]);
                break;

            case 'publish':
                template_data = template_data.replace('{{publish}}', blocks[l - 1]);
                break;

            case 'readLength':
                template_data = template_data.replace('{{readLength}}', blocks[l - 1]);
                break;

            case 'tags':
                template_data = template_data.replace('{{tags}}', putTags(blocks[l - 1]));
                break;

            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'p':
                let s = parseString(blocks);
                body += s;
                break;

            case 'code':
                body += `<div class="code"><pre><code class="${blocks[1]}">${blocks[l - 1]}</code></pre></div>`;
                break;

            case '----':
                body += '<hr>';
                break;

            default:
        }
    }

    return template_data.replace('{{body}}', body);
}

function putTags(str) {
    const tags = str.split(',');
    let s = '';

    tags.forEach(tag => {
        s += `<li>${tag.trim()}</li>`;
    });

    return s;
}

function parseString(block) {
    const tag = block[0];
    let texts = block[block.length - 1].trim().split('\n'),
        l = texts.length;

    if(!l) return;

    for(let i = 0; i < l; i++) {
        texts[i] = texts[i].trim();
    }

    texts = texts.join('<br>').replace('<br><br>', `</${tag}><${tag}>`);
    return `<${tag}>${texts}</${tag}>`;
}

function writeHTML(data, path) {
    fs.writeFile(`${path}/sample.html`, data, err => {
        if(err) throw err;
        console.log('Done');
    });
}

init();