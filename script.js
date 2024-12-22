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

class ControlPanel {
    constructor(element, parent) {
        this.parent = parent;
        this.element = element;
        this.modal = this.createModal();
        this.selectedElement = element; // Start with canvas as default parent
    }

    init() {
        const controlPanalHandle = document.createElement('div');
        controlPanalHandle.classList.add(this.element.id+'-control-panal-handle');
        controlPanalHandle.style.width= "10px",
        controlPanalHandle.style.height= "10px",
        controlPanalHandle.style.backgroundColor= "green",
        controlPanalHandle.style.position= "absolute",
        controlPanalHandle.style.cursor= "nwse-resize"
        this.element.appendChild(controlPanalHandle);

        controlPanalHandle.addEventListener('click', (e) => {
            e.preventDefault();
            if(this.modal.style.display !== "block") this.open()
            else this.close()
        });
    }

    applyStyles() {
        // Border Styles
        this.BorderController.applyStyles(this.element.id);
        // color and image
        this.BackgroundController.applyStyles(this.element.id); 
        // // Text & Color
        this.TextAndColorController.applyStyles(this.element.id)
        // // Font
        this.FontController.applyStyles(this.element.id)

        // display padding and margin and rotate 
        this.DisplayController.applyStyles(this.element.id)
    }

    // Create modal control panel UI
    createModal() {
        const modal = document.createElement('div');
        modal.id = this.element.id+'-control-modal';
        modal.classList.add('control-modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Add Elements Section
        const addElementsSection = document.createElement('div');
        addElementsSection.innerHTML = `
            <div style='display: flex; justify-content: space-between;align-items: center;'>
                <h3>Add Element</h3>
                <div id="${this.element.id}-model-close">Close</div>
            </div>
            <button id="${this.element.id}-add-div">Add Div</button>
        `;
        modalContent.appendChild(addElementsSection);

        // Append the modal to body
        modal.appendChild(modalContent);
        document.body.appendChild(modal);


        this.BorderController = new BorderController(this.element, this.parent, modal);
        this.ExportElement = new ExportElement(this.element, this.parent, modal);
        this.BackgroundController = new BackgroundController(this.element, this.parent, modal);
        this.Resizable = new Resizable(this.element, this.parent, modal);
        this.DisplayController = new DisplayController(this.element, this.parent, modal);
        this.TextAndColorController = new TextAndColorController(this.element, this.parent, modal);
        this.FontController = new FontController(this.element, this.parent, modal);
        this.bindControlEvents()

        // apply style button and event
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Styles';
        applyButton.addEventListener('click', () => this.applyStyles());
        modalContent.appendChild(applyButton);
        document.getElementById(this.element.id+"-model-close").addEventListener('click', () => this.close());
        return modal;
    }

    // Open the modal
    open() {
        this.modal.style.display = 'block';
    }

    // Close the modal
    close() {
        this.modal.style.display = 'none';
    }

    // Bind events to the control panel
    bindControlEvents() {
        const addDivBtn = document.getElementById(this.element.id+'-add-div');

        // Add Div, Span, and Img elements
        addDivBtn.addEventListener('click', () => this.addElement('div'));
    }

    // Dynamically add elements to the parent (or selected element)
    addElement(type) {
        const newElement = document.createElement(type);
        newElement.id = 'element-' + elementCounter++;
        // Attach new element to the current selected parent
        this.selectedElement.appendChild(newElement);
    
        // Attach the element to the engine
        new ElementEngine(newElement, this.selectedElement);
    }

    // Update the selected element and rebind controls to the new element
    updateSelectedElement(element) {
        this.selectedElement = element;

        // Rebind control panel to the new selected element's dimensions
        const widthRange = document.getElementById('resize-width');
        const heightRange = document.getElementById('resize-height');

        widthRange.value = parseInt(window.getComputedStyle(element).width);
        heightRange.value = parseInt(window.getComputedStyle(element).height);
    }
}

class ExportElement {
    constructor(element, parent, model) {
        this.element = element;
        this.parent = parent;
        this.model = model;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.innerHTML = `<button id="${this.element.id}-export-button">Click To Export</button>`;

        this.model.appendChild(this.container)
        document.getElementById(`${this.element.id}-export-button`).addEventListener('click', ()=> {
            exportDomTree(this.element.id)
        })
    }
}

class BorderController {
    constructor(element, parent, model) {
        this.element = element;
        this.parent = parent;
        this.model = model;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.innerHTML = '<h3>Border Controller</h3>';
        
        createInput('Border Color', 'color', this.element.id+'-border-color', this.container, null, null, ()=> {
            this.element.style.border
        });
        this.container.innerHTML += '<br />';
        createInput('Border Width (px)', 'number', this.element.id+'-border-width', this.container, 0);
        this.container.innerHTML += '<br />';
        createInput('Border Radius (px)', 'number', this.element.id+'-border-radius', this.container, 0);
        this.container.innerHTML += '<br />';
        const borderTypeLabel = document.createElement('label');
        borderTypeLabel.textContent = 'Border Type';
        const borderTypeSelect = document.createElement('select');
        borderTypeSelect.id = this.element.id+'-border-type';
        ['solid', 'dashed', 'dotted'].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            borderTypeSelect.appendChild(option);
        });
        this.container.appendChild(borderTypeLabel);
        this.container.appendChild(borderTypeSelect);

        this.model.appendChild(this.container);
    }

    applyStyles(id) {
        const outputBox = document.getElementById(id);

        const borderColor = document.getElementById(id+'-border-color').value;
        const borderWidth = document.getElementById(id+'-border-width').value;
        const borderRadius = document.getElementById(id+'-border-radius').value;
        const borderType = document.getElementById(id+'-border-type').value;

        outputBox.style.borderColor = borderColor;
        outputBox.style.borderWidth = borderWidth + 'px';
        outputBox.style.borderRadius = borderRadius + 'px';
        outputBox.style.borderStyle = borderType;
    }
}

class BackgroundController {
    constructor(element, parent, model) {
        this.model = model;
        this.parent = parent;
        this.element = element;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.innerHTML = '<h3>Background Controller</h3>';
        
        createInput('Background Color', 'color', this.element.id+'-background-color', this.container);
        createInput('Background Image URL', 'text', this.element.id+'-background-img', this.container);

        this.model.appendChild(this.container);
    }

    applyStyles(id) {
        const outputBox = document.getElementById(id);
        // Background
        const backgroundColor = document.getElementById(id+'-background-color').value;
        const backgroundImg = document.getElementById(id+'-background-img').value;

        outputBox.style.backgroundColor = backgroundColor;
        outputBox.style.backgroundImage = backgroundImg ? `url(${backgroundImg})` : 'none';
        outputBox.style.backgroundSize = 'cover';
    }
}

class DisplayController {
    constructor(element, parent, model) {
        this.model = model;
        this.parent = parent;
        this.element = element;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.innerHTML = '<h3>Display Controller</h3>';
        
        createInput('Padding (px)', 'number', this.element.id+'-padding', this.container, 0);
        createInput('Margin (px)', 'number', this.element.id+'-margin', this.container, 0);
        createInput('Rotate (degrees)', 'number', this.element.id+'-rotate-degree', this.container, 0, 360);

        this.model.appendChild(this.container);
    }

    applyStyles(id) {
        const outputBox = document.getElementById(id);
        // Display
        const padding = document.getElementById(id+'-padding').value;
        const margin = document.getElementById(id+'-margin').value;
        const rotateDegree = document.getElementById(id+'-rotate-degree').value;

        outputBox.style.padding = padding + 'px';
        outputBox.style.margin = margin + 'px';
        outputBox.style.transform = `rotate(${rotateDegree}deg)`;
    }
}

class TextAndColorController {
    constructor(element, parent, model) {
        this.model = model;
        this.parent = parent;
        this.element = element;
        this.init();
    }

    init() {
        const outputBox = document.getElementById(this.element.id);
        const textElement = document.createElement('span');
        textElement.id = this.element.id+"-child-text-context";
        textElement.textContent = 'edit me'
        outputBox.appendChild(textElement)
        let inputElement = null; // Variable to store the input element when created

        // Function to make the element editable
        function makeEditable() {
        // Create an input element and set its value to the current text
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = textElement.textContent;
            inputElement.classList.add('editable-input');

            // Replace the text element with the input element
            textElement.replaceWith(inputElement);

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
            textElement.textContent = inputElement.value;

            // Replace the input element with the original text element
            inputElement.replaceWith(textElement);
            inputElement = null;
            }

            // Add a click event listener to the text element
            textElement.addEventListener('click', makeEditable);

            // Add a listener to the document to detect clicks outside the input
            document.addEventListener('click', function (e) {
            if (inputElement && !inputElement.contains(e.target) && e.target !== textElement) {
                makeNonEditable();
            }
            });
        }

    applyStyles(id) {
        const outputBox = document.getElementById(id+"-child-text-context");
        const textContent = document.getElementById(id+'-text-content').value;
        // const textColor = document.getElementById(id+'-text-color').value;

        // outputBox.textContent = textContent;// || 'Preview Box';
        outputBox.style.color = textColor;
    }
}

class FontController {
    constructor(element, parent, model) {
        this.model = model;
        this.parent = parent;
        this.element = element;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.innerHTML = '<h3>Font Controller</h3>';
        
        createInput('Font Size (px)', 'number', this.element.id+'-font-size', this.container, 8, 72);
        createInput('Font Family', 'text', this.element.id+'-font-family', this.container);

        this.model.appendChild(this.container);
    }

    applyStyles(id) {
        const outputBox = document.getElementById(id+"-child-text-context");
        const fontSize = document.getElementById(id+'-font-size').value;
        const fontFamily = document.getElementById(id+'-font-family').value;

        outputBox.style.fontSize = fontSize + 'px';
        outputBox.style.fontFamily = fontFamily;
    }
}

class Draggable {
    constructor(element) {
        this.element = element;
        this.parent = element.parentElement; // Automatically detect parent
        this.isDragging = false;
        this.elementRect = null;
        this.parentRect = null;
        this.startX = 0;
        this.startY = 0;
    }

    // Initialize drag events
    addDragEvents() {
        this.element.addEventListener('mousedown', this.dragStart.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));

        // Prevent default drag behavior
        this.element.addEventListener('dragstart', (e) => e.preventDefault());
    }

    // Called when drag starts
    dragStart(e) {
        e.stopPropagation(); // Stop propagation to prevent parent from triggering

        // Cache element and parent dimensions for performance
        this.elementRect = this.element.getBoundingClientRect();
        this.parentRect = this.parent.getBoundingClientRect();

        this.startX = e.clientX - this.elementRect.left;
        this.startY = e.clientY - this.elementRect.top;
        this.isDragging = true;

        this.element.style.cursor = 'grabbing';
    }

    // Called during dragging
    drag(e) {
        if (!this.isDragging || !this.elementRect || !this.parentRect) return;

        e.preventDefault(); // Prevent text selection while dragging

        // Calculate the new position relative to the immediate parent
        let newLeft = e.clientX - this.parentRect.left - this.startX;
        let newTop = e.clientY - this.parentRect.top - this.startY;

        // Constrain the draggable element within the parent
        const maxLeft = this.parentRect.width - this.elementRect.width;
        const maxTop = this.parentRect.height - this.elementRect.height;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        // Set new position
        this.element.style.position = 'absolute';
        this.element.style.left = newLeft + 'px';
        this.element.style.top = newTop + 'px';
    }

    // Called when the drag ends
    dragEnd(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.element.style.cursor = 'grab';
            this.elementRect = null;  // Clear cached rect values after drag ends
            this.parentRect = null;
        }
    }

    // Helper function to enable dragging for all nested elements
    static enableDraggables(rootElement) {
        const draggableElements = rootElement.querySelectorAll('[data-draggable]'); // Mark elements as draggable
        draggableElements.forEach((el) => {
            const draggableInstance = new Draggable(el);
            draggableInstance.addDragEvents();
        });
    }
}



class Resizable {
    constructor(element, model) {
        this.element = element;
        this.model = model;
        this.init();
    }

    // Initialize the resizable element
    init() {
        // Create resize handles
        this.createResizeHandles();

        // Enable draggable resizing
        this.addResizeEvents();
    }

    // Create resize handles on corners
    createResizeHandles() {
        // Four corner handles: top-left, top-right, bottom-left, bottom-right
        const handles = ['bottom-right'];
        handles.forEach(handle => {
            const handleDiv = document.createElement('div');
            handleDiv.className = `resize-handle ${handle}`;
            this.element.appendChild(handleDiv);  // Append handle to element
        });

        // Style the handles (you can move this to your CSS)
        const style = document.createElement('style');
        style.innerHTML = `
            .resize-handle {
                width: 5px;
                height: 5px;
                background-color: rgba(0,0,0,0.5);
                position: absolute;
                z-index: 10;
            }
            .resize-handle.top-left { top: -5px; left: -5px; cursor: nwse-resize; }
            .resize-handle.top-right { top: -5px; right: -5px; cursor: nesw-resize; }
            .resize-handle.bottom-left { bottom: -5px; left: -5px; cursor: nesw-resize; }
            .resize-handle.bottom-right { bottom: -5px; right: -5px; cursor: nwse-resize; }
        `;
        document.head.appendChild(style);
    }

    // Add resize events for each handle
    addResizeEvents() {
        const resizeHandles = this.element.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', this.resizeStart.bind(this));
        });

        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.resizeEnd.bind(this));

        this.isResizing = false;
        this.currentHandle = null;
    }

    // Called when resize starts
    resizeStart(e) {
        e.stopPropagation();  // Prevent triggering drag
        this.isResizing = true;
        this.currentHandle = e.target;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseFloat(getComputedStyle(this.element, null).getPropertyValue('width').replace('px', ''));
        this.startHeight = parseFloat(getComputedStyle(this.element, null).getPropertyValue('height').replace('px', ''));
        this.startLeft = this.element.offsetLeft;
        this.startTop = this.element.offsetTop;
    }

    // Called during the resize
    resize(e) {
        if (!this.isResizing) return;

        let width = this.startWidth;
        let height = this.startHeight;
        let top = this.startTop;
        let left = this.startLeft;

        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        // Resize based on which handle is being dragged
        if (this.currentHandle.classList.contains('bottom-right')) {
            width = this.startWidth + dx;
            height = this.startHeight + dy;
        } else if (this.currentHandle.classList.contains('bottom-left')) {
            width = this.startWidth - dx;
            height = this.startHeight + dy;
            left = this.startLeft + dx;  // Adjust left position when resizing from left
        } else if (this.currentHandle.classList.contains('top-right')) {
            width = this.startWidth + dx;
            height = this.startHeight - dy;
            top = this.startTop + dy;  // Adjust top position when resizing from top
        } else if (this.currentHandle.classList.contains('top-left')) {
            width = this.startWidth - dx;
            height = this.startHeight - dy;
            left = this.startLeft + dx;  // Adjust left position when resizing from left
            top = this.startTop + dy;  // Adjust top position when resizing from top
        }

        // Apply constraints: Minimum size
        width = Math.max(50, width);
        height = Math.max(50, height);

        // Apply the new width, height, top, and left
        this.element.style.width = width + 'px';
        this.element.style.height = height + 'px';
        this.element.style.top = top + 'px';
        this.element.style.left = left + 'px';
    }

    // Called when resizing ends
    resizeEnd(e) {
        this.isResizing = false;
        this.currentHandle = null;
    }
}


class Rotatable {
    constructor(element) {
        this.element = element;
        this.rotation = 0; // Initial rotation value
        this.initialRotation = 0; // To store the initial rotation value
        this.initialAngle = 0; // To store the initial angle between the two pointers

        this.activePointers = new Map(); // Track multiple pointers

        // Bind methods
        this.startRotation = this.startRotation.bind(this);
        this.rotateElement = this.rotateElement.bind(this);
        this.stopRotation = this.stopRotation.bind(this);

        // Add pointer events
        this.element.addEventListener('pointerdown', this.startRotation);
        this.element.addEventListener('pointermove', this.rotateElement);
        this.element.addEventListener('pointerup', this.stopRotation);
        this.element.addEventListener('pointercancel', this.stopRotation); // In case the pointer gets canceled
    }

    startRotation(e) {
        // Add the pointer to the active pointers map
        this.activePointers.set(e.pointerId, e);

        if (this.activePointers.size === 2) {
            // When two pointers are active, calculate the initial angle
            const pointers = Array.from(this.activePointers.values());
            this.initialAngle = this.getAngle(pointers);

            // Save the current rotation from the element's transform
            const currentTransform = window.getComputedStyle(this.element).transform;
            if (currentTransform !== 'none') {
                const matrix = currentTransform.split('(')[1].split(')')[0].split(',');
                const a = matrix[0];
                const b = matrix[1];
                this.rotation = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            }
            this.initialRotation = this.rotation;
        }
    }

    rotateElement(e) {
        if (this.activePointers.size === 2) {
            // Update the pointer position in the map
            this.activePointers.set(e.pointerId, e);

            // Get the updated angle between the two pointers
            const pointers = Array.from(this.activePointers.values());
            const newAngle = this.getAngle(pointers);

            // Calculate the difference in angle and apply it to the rotation
            const angleDifference = newAngle - this.initialAngle;
            this.rotation = this.initialRotation + angleDifference;

            // Apply the rotation to the element
            this.element.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    stopRotation(e) {
        // Remove the pointer from the active pointers map
        this.activePointers.delete(e.pointerId);

        if (this.activePointers.size < 2) {
            // If fewer than two pointers are active, stop rotating
            this.initialAngle = 0;
        }
    }

    // Helper function to calculate the angle between two pointers
    getAngle(pointers) {
        const [pointer1, pointer2] = pointers;

        const deltaX = pointer2.clientX - pointer1.clientX;
        const deltaY = pointer2.clientY - pointer1.clientY;

        // Calculate the angle in degrees
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }
}

class OpacityChanger {
    constructor(element) {
        this.element = element;
        this.opacity = 1; // Initial opacity (fully visible)

        // Bind methods
        this.changeOpacity = this.changeOpacity.bind(this);
    }

    addOpacityEvents() {
        this.element.addEventListener('wheel', this.changeOpacity);
    }

    changeOpacity(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1; // Scroll down decreases opacity, scroll up increases
        this.opacity = Math.min(1, Math.max(0, this.opacity + delta)); // Clamp between 0 and 1
        this.element.style.opacity = this.opacity;
    }
}

class BorderCurve {
    constructor(element) {
        this.element = element;
        this.borderRadius = 0; // Initial border radius value

        // Bind methods
        this.startBorderCurve = this.addBorderCurveEvents.bind(this);
        this.changeBorderCurve = this.changeBorderCurve.bind(this);
        this.stopBorderCurve = this.stopBorderCurve.bind(this);
    }

    addBorderCurveEvents() {
        const curveHandle = document.createElement('div');
        curveHandle.classList.add('curve-handle');
        // this.element.appendChild(curveHandle);

        curveHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.addEventListener('mousemove', this.changeBorderCurve);
            document.addEventListener('mouseup', this.stopBorderCurve);
        });
    }

    changeBorderCurve(e) {
        const rect = this.element.getBoundingClientRect();
        const distance = Math.min(e.clientX - rect.left, e.clientY - rect.top); // Distance from the top-left corner
        this.borderRadius = Math.max(0, distance); // Ensure positive values
        this.element.style.borderRadius = this.borderRadius + 'px';
    }

    stopBorderCurve() {
        document.removeEventListener('mousemove', this.changeBorderCurve);
        document.removeEventListener('mouseup', this.stopBorderCurve);
    }
}

class RenderInCanvas {
    
}


class ElementEngine {
    constructor(element, parent) {
        this.element = element;
        this.parent = parent;
        // Attach Draggable, Resizable, Rotatable, Opacity, BorderCourve functionality
        this.draggable = new Draggable(element, parent);
        this.rotatable = new Rotatable(element);
        this.opacityChanger = new OpacityChanger(element);
        this.borderCurve = new BorderCurve(element);
        this.controlPanel = new ControlPanel(element, parent); // Bind control panel
        this.init();
    }

    init() {
        this.element.classList.add('element');
        this.element.setAttribute('draggable', 'true');
        this.draggable.addDragEvents();
        this.opacityChanger.addOpacityEvents(); // Add opacity change
        this.borderCurve.startBorderCurve(); // Add border curve
        this.controlPanel.init();
    }
}

let elementCounter = 0;

// Add element to canvas
function addElement(type, id) {
    const canvas = document.getElementById(id);
    const newElement = document.createElement(type);
    newElement.id = 'element-' + elementCounter++;
    // newElement.textContent = type;
    canvas.appendChild(newElement);

    // Attach the element to the engine
    new ElementEngine(newElement, canvas);
}

// Recursive function to serialize the DOM tree
function serializeDomTree(element) {
    return {
        type: element.tagName.toLowerCase(),
        style: element.getAttribute('style'),
        children: [...element.children].map(serializeDomTree)
    };
}

// Export the DOM structure to JSON
function exportDomTree(id) {
    console.log("canvas --<> ", id);
    const canvas = document.getElementById(id);
    console.log("canvas --<> ", canvas);
    
    const jsonStructure = serializeDomTree(canvas);
    console.log(JSON.stringify(jsonStructure, null, 2));
}

(()=> {
    const canvas_id = document.getElementById("dynamic-ui-gen").dataset.generetorid;
    const element = document.createElement('div');
    element.id = canvas_id;
    document.getElementsByTagName('body')[0].appendChild(element)
    addElement('div', canvas_id);
})()