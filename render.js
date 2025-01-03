/*
 ----------------------V2 Basic Render------------------------------
*/
const RenderInCanvasEx = (json_data, parent_id)=> {
    const element = document.createElement(json_data.type);
    if(json_data.style) element.style = json_data.style;
    if(json_data.id) element.id = json_data.id;
    if(json_data.class) element.className = json_data.class;
    if(json_data.text) element.innerText = json_data.text;
    if(json_data.draggable) element.draggable = json_data.draggable;
    
    document.getElementById(parent_id).appendChild(element);
    if(json_data.children && Array.isArray(json_data.children) && json_data.id) {
        json_data.children.forEach((v)=> RenderInCanvasEx(v, json_data.id));
    }
}

// Export the DOM structure to JSON
function exportDomTree(id) {
    const canvas = document.getElementById(id);
    const jsonStructure = serializeDomTree(canvas);
    document.getElementById("canvas").remove();
    RenderInCanvasEx(jsonStructure, "result");
    console.log(JSON.stringify(jsonStructure, null, 2)); 
}

// Recursive function to serialize the DOM tree
function serializeDomTree(element) {
    return {
        type: element.tagName.toLowerCase(),
        style: element.getAttribute('style'),
        class: element.className,
        text: element.innerText,
        id: element.getAttribute('id'),
        draggable: element.getAttribute('draggable'),
        children: [...element.children].map(serializeDomTree)
    };
}

/*
 ----------------------V2 Component Based Render------------------------------
*/
const RenderInCanvasExV2 = (element_id)=> {
    const json_data = CanvasJSON[element_id];
    const parent_id = json_data.parent_id; 
    console.log("json_data.payload --> ", json_data.payload);
    
    const element = ComponentRegistry[json_data.gen_name](...json_data.payload);
    element.id = element_id;
    if(json_data.style) element.style = json_data.style;
    const parentEle = document.getElementById(parent_id);
    if(parentEle) parentEle.appendChild(element);
    if(json_data.children && Array.isArray(json_data.children) && json_data.element_id) {
        json_data.children.forEach((child_id)=> RenderInCanvasExV2(child_id, json_data.element_id));
    }
}

function exportDomTreeV2(id) {
    const result = document.createElement("div");
    result.id = "result";
    result.style = "width: 100%; height: 100vh;";
    document.getElementsByTagName('body')[0].appendChild(result);
    getSerialPropertiesOfElement(id);
    console.log("CanvasJSON --> ", CanvasJSON);
    const canvas = document.getElementById("canvas")
    if(canvas) canvas.remove();
    RenderInCanvasExV2(id)
}

function getSerialPropertiesOfElement(element_id) {
    const ele = document.getElementById(element_id);
    const json_data = CanvasJSON[element_id];
    if(!json_data) {
        throw new Error("Issue with CanvasJson Not having: ", element_id)
    }
    const childrens = json_data.children;
    if(ele) json_data.style = ele.getAttribute('style');
    childrens.forEach((v)=> {
        getSerialPropertiesOfElement(v);
    })
}