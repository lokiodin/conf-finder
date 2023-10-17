let fileContent;
const CONF_SEPARATOR = '!#'

const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        fileContent = event.target.result;
        searchString();

        let content = []
        let newblock = []
        let fullcontent = fileContent.split('\n');
        for (i = 0; i < fullcontent.length; i++) {

            let linematch = fullcontent[i].match(/^[a-zA-Z!#]/g);
            // TODO: Ca fonctionne pas ...
            // this is a new block
            if (linematch != null) {
                text = linematch[0];
                newblock.push(text)

                if (i == fullcontent.length - 2) {
                    var next = fullcontent[i + 1].match(/^[a-zA-Z!#]/g);
                    if (next != null) {
                        content.push(newblock);
                        newblock = [];
                    }
                    next = null
                } else {
                    content.push(newblock);
                }
            } else { }
        }

        console.log(content);


    };
    reader.readAsText(file);
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    readFile(file);
};

const searchString = () => {
    const input = document.getElementById('searchInput').value;
    if (!fileContent) {
        document.getElementById('searchResult').innerHTML = 'Please upload a file first.';
        return;
    }

    if (input === '') {
        document.getElementById('searchResult').innerHTML = '<pre>' + fileContent + '</pre>';
        return;
    }

    try {
        const regex = new RegExp(input, 'g');
        const lines = fileContent.split('\n');
        const matchedLines = lines.filter(line => line.match(regex));

        if (matchedLines.length > 0) {
            const highlightedLines = matchedLines.map(line => line.replace(regex, `<span class="highlight">$&</span>`));
            document.getElementById('searchResult').innerHTML = '<pre>' + highlightedLines.join('\n') + '</pre>';
        } else {
            document.getElementById('searchResult').innerHTML = 'String not found in the file.';
        }

    } catch (error) {
        document.getElementById('searchResult').innerHTML = 'Invalid regular expression';
    }
};

document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('searchInput').addEventListener('input', searchString);