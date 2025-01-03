let elementCounter = 0;
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

        this.injectReqMutationEventAndFuntions();
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

    // Update the selected element and rebind controls to the new element
    updateSelectedElement(element) {
        this.selectedElement = element;

        // Rebind control panel to the new selected element's dimensions
        const widthRange = document.getElementById('resize-width');
        const heightRange = document.getElementById('resize-height');

        widthRange.value = parseInt(window.getComputedStyle(element).width);
        heightRange.value = parseInt(window.getComputedStyle(element).height);
    }

    // get input from element
    injectReqMutationEventAndFuntions() {
        const modal = document.getElementById(this.element.id+'-control-modal');
        const ele = CanvasJSON[this.element.id];
        if(ele && Array.isArray(ele.payload) && ele.payload.length > 0) {
            const payload = ele.payload;
            const labels = Object.keys(payload[0]);
            labels.map((label)=> {
                const unique_id = label+"-"+this.element.id;
                createInput(label, 'text', unique_id, modal, null, null, (e)=> {
                    ele.payload[0][label] = e
                });
            })
        }
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

function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true; // This will load the script asynchronously
  
      script.onload = () => {
        console.log(`Script loaded: ${url}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        reject();
      };
  
      document.head.appendChild(script);
    });
  }
  
  // URLs of scripts to load
const scriptUrls = [
    window.location.origin+"/featuers.js",
    window.location.origin+"/registry.js",
    window.location.origin+"/canvas_json_container.js",
    window.location.origin+"/render.js",
    window.location.origin+"/script.js"
];
  
async function loadAllScriptsConcurrently() {
    return await Promise.all(scriptUrls.map(url => loadScript(url)))
}

(async ()=> {
    await loadAllScriptsConcurrently();
    const canvas_id = document.getElementById("dynamic-ui-gen").dataset.generetorid;
    const element = document.createElement('div');
    element.id = canvas_id;
    document.getElementsByTagName('body')[0].append(...document.getElementsByTagName('body')[0].children, element)
    const canvas = document.getElementById(canvas_id);
    const newElement = document.createElement('div');
    newElement.id = 'element-' + elementCounter++;
    AddFeatureIntoCanvasJSON({parent_id: "result", gen_name: "addElement", element_id: newElement.id, payload:[{parentId: newElement.id}]})
    canvas.appendChild(newElement);
    new ElementEngine(newElement, canvas);
})()