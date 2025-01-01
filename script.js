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
        // this.TextAndColorController.applyStyles(this.element.id)
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


        // this.BorderController = new BorderController(this.element, this.parent, modal);
        this.ExportElement = new ExportElement(this.element, this.parent, modal);
        // this.BackgroundController = new BackgroundController(this.element, this.parent, modal);
        this.Resizable = new Resizable(this.element, this.parent, modal);
        // this.DisplayController = new DisplayController(this.element, this.parent, modal);
        // this.TextAndColorController = new TextAndColorController(this.element, this.parent, modal);
        this.Features = new Features(this.element, this.parent, modal);
        // this.FontController = new FontController(this.element, this.parent, modal);
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

(()=> {
    const canvas_id = document.getElementById("dynamic-ui-gen").dataset.generetorid;
    const element = document.createElement('div');
    element.id = canvas_id;
    document.getElementsByTagName('body')[0].append(...document.getElementsByTagName('body')[0].children, element)
    const canvas = document.getElementById(canvas_id);
    const newElement = document.createElement('div');
    newElement.id = 'element-' + elementCounter++;
    AddFeatureIntoCanvasJSON({parent_id: "result", gen_name: "addElement", element_id: newElement.id, payload:[]})
    // newElement.textContent = type;
    canvas.appendChild(newElement);
    // Attach the element to the engine
    new ElementEngine(newElement, canvas);
})()