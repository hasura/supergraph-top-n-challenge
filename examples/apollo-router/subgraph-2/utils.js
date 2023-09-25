const getFields = (info) => {
    // ideally use graphql-parse-resolve library to parse the info object
    let fields = [];
    info.fieldNodes[0].selectionSet.selections.map((field) => fields.push(field.name.value));
    //return fields;
    return ["*"];
}

export { getFields };