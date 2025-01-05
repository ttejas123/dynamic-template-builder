// Proxy handler to detect changes to the couponData object
const handler = {
    set: function(target, key, value) {
      if (target[key] !== value) {  // Only update if the value has changed
        target[key] = value;        // Update the target object
        // console.log(value);
        exportDomTreeV2("element-0")
        // updateDOM(key, value);      // Call the function to update the DOM
      }
      return true;
    }
};

// Create a proxy to wrap the couponData object
const CanvasJSON = {}
const CanvasData = new Proxy({}, handler); // to make event based updates in 

setTimeout(()=> {
    CanvasData["element-1"] = {
        "content": "This is the content of the card. but controlled",
        "parentId": "element-0",
        "title": "Card Title"
    }
}, 15000)

const findElementInJsonAndReturn = (parent_id, CJson)=> {
    if(parent_id == null || parent_id == undefined) {
        return CJson;
    }

    if(CJson.id == parent_id) return CJson;

    if(Array.isArray(CJson.children) && CJson.children.length > 0) {
        const val = null;
        CJson.children.forEach(v=> {
            const _ = findElementInJsonAndReturn(parent_id, v);
            if(_ != null && _ != undefined) val = _;
        })
        return val;
    }
    return null;
}

const AddElementToCanvasJson = (parent_id = null, json)=> {
    const getParent = findElementInJsonAndReturn(parent_id);
    if(getParent == null || getParent == undefined) throw new Error("Issue With parent because not exist!!");
    getParent.children.push(json);
}

const AddEventListenerToElement = (element_id, action) => {
    const getElement = findElementInJsonAndReturn(element_id);
    if(getElement == null || getElement == undefined) throw new Error("Issue With element because not exist!!");
    getElement.ctx = getElement.ctx ? {
        actions: [...getElement.ctx.actions, action]
    } : {
        actions: [action]
    }
}

const AddFeatureIntoCanvasJSON = ({parent_id, element_id, payload, gen_name}) => {
    if(CanvasJSON[parent_id]) {
        CanvasJSON[parent_id].children.push(element_id)
    } else {
        CanvasJSON[parent_id] = {
            children: [element_id],
            payload: [{parentId: element_id}],
            gen_name: null,
            element_id: null,
            parent_id: parent_id
        }

    }
    CanvasJSON[element_id] = {
            payload,
            element_id,
            gen_name,
            parent_id,
            children: []
    }
} 