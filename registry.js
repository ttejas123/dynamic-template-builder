function createInput(labelText, inputType, id, parentElement, min = null, max = null, cb=null) {
    const label = document.createElement('label');
    label.textContent = labelText+" ";
    const input = document.createElement('input');
    input.type = inputType;
    input.id = id;
    if (min !== null) input.min = min;
    if (max !== null) input.max = max;
    parentElement.appendChild(label);
    parentElement.appendChild(input);

    if(cb != null) {
        input.addEventListener('change', function (e) {
            cb(e.target.value);
        });

    }
}

// createCard('myContainer', 'Card Title', 'This is the content of the card.');
function createCard(parentId, title, content) {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error(`Parent element with ID '${parentId}' not found.`);
        return;
    }

    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.padding = '16px';
    card.style.margin = '16px';
    card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    
    const cardTitle = document.createElement('h3');
    cardTitle.innerText = title;
    
    const cardContent = document.createElement('p');
    cardContent.innerText = content;
    
    card.appendChild(cardTitle);
    card.appendChild(cardContent);
    parentElement.appendChild(card);
    return card;
}

// createAvatar('myContainer', 'https://via.placeholder.com/150', '80px');
function createAvatar(parentId, imgUrl, size = '100px') {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error(`Parent element with ID '${parentId}' not found.`);
        return;
    }

    const avatar = document.createElement('div');
    avatar.style.backgroundImage = imgUrl ? `url(${imgUrl})` : 'none';
    avatar.style.backgroundSize = 'cover';
    avatar.style.width = size;
    avatar.style.height = size;
    avatar.style.borderRadius = '50%';
    avatar.style.objectFit = 'cover';
    avatar.style.border = '2px solid #ccc';

    parentElement.appendChild(avatar);
    return avatar;
}


/*
const data = [
    { Name: 'John Doe', Age: 28, Country: 'USA' },
    { Name: 'Jane Smith', Age: 32, Country: 'UK' }
];
createDataTable('myContainer', data);
*/
function createDataTable(parentId, data) {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error(`Parent element with ID '${parentId}' not found.`);
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    
    // Create header based on keys from the first object
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.innerText = key;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table rows
    data.forEach(rowData => {
        const row = document.createElement('tr');
        Object.values(rowData).forEach(value => {
            const td = document.createElement('td');
            td.innerText = value;
            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    parentElement.appendChild(table);
    return table;
}

/*
createSearchBox('myContainer', 'Search...', (query) => {
    console.log('Search query:', query);
})
*/
function createSearchBox(parentId, placeholder, onSearch) {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error(`Parent element with ID '${parentId}' not found.`);
        return;
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.style.padding = '8px';
    input.style.width = '100%';
    input.style.marginBottom = '16px';

    const button = document.createElement('button');
    button.innerText = 'Search';
    button.style.padding = '8px 16px';
    button.style.marginLeft = '8px';

    button.addEventListener('click', () => {
        onSearch(input.value);
    });

    parentElement.appendChild(input);
    parentElement.appendChild(button);
    return input;
}

/*
    createHeading('myContainer', 'Welcome to My Site', 1);  // Creates an <h1>
    createHeading('myContainer', 'Section Title', 2);  // Creates an <h2>
*/
function createHeading(parentId, text, level = 1) {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error(`Parent element with ID '${parentId}' not found.`);
        return;
    }

    const heading = document.createElement(`h${level}`);
    heading.innerText = text;
    heading.style.margin = 0;

    parentElement.appendChild(heading)
    let inputElement = null; // Variable to store the input element when created

        // Function to make the element editable
    function makeEditable() {
    // Create an input element and set its value to the current text
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = heading.textContent;
        inputElement.classList.add('editable-input');

        // Replace the text element with the input element
        heading.replaceWith(inputElement);

        // Focus on the input element
        inputElement.focus();

        // Listen for the Enter key or when focus is lost to stop editing
        inputElement.addEventListener('blur', makeNonEditable);
        inputElement.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                makeNonEditable();
            }
        });
    }

        // Function to stop editing and revert back to normal text
    function makeNonEditable() {
        // Update the text content with the value from the input field
        heading.innerHTML = inputElement.value;

        // Replace the input element with the original text element
        inputElement.replaceWith(heading);
        inputElement = null;
        new ElementEngine(heading, parentElement);
    }

        // Add a click event listener to the text element
    heading.addEventListener('click', makeEditable);

    // Add a listener to the document to detect clicks outside the input
    document.addEventListener('click', function (e) {
        if (inputElement && !inputElement.contains(e.target) && e.target !== heading) {
            makeNonEditable();
        }
    });
    return heading;
}


// Add element to canvas
function addElement(parentId) {
    const canvas = document.getElementById(parentId);
    const newElement = document.createElement('div');
    newElement.id = 'element-' + elementCounter++;
    // newElement.textContent = type;
    if(canvas) canvas.appendChild(newElement);

    return newElement;
}

/*
    createEventAction('myContainer', 'click', 'eval', '<Exec_Function>');  // Creates an <h1>
    createEventAction('myContainer', 'change', 'fun', '<Function_Name>');  // Creates an <h2>
*/
function createEventAction(element_id, action, func_type, func_exec) {
    return {
        'action': action,
        'element_id': element_id,
        'func': {
            'type': func_type,
            'exec': func_exec
        }
    }
}

const ComponentRegistry = {
    createCard: ({parentId, title, content}) => createCard(parentId, title, content),
    createAvatar: ({parentId, imgUrl, size}) => createAvatar(parentId, imgUrl, size),
    createDataTable: ({parentId, data}) => createDataTable(parentId, data),
    createSearchBox: ({parentId, placeholder, onSearch}) => createSearchBox(parentId, placeholder, onSearch),
    createHeading: ({parentId, text, level}) => createHeading(parentId, text, level),
    addElement: ({parentId}) => addElement(parentId),
};