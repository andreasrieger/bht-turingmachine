function initDiagram(graphs, links) {

    const myDiagram =
        new go.Diagram("myDiagramDiv",  // create a Diagram for a HTML Div element
            { "undoManager.isEnabled": true }, // enable undo & redo
        );

    myDiagram.layout = new go.LayeredDigraphLayout({ columnSpacing: 50 });

    // define a simple Node template
    myDiagram.nodeTemplate =
        new go.Node("Auto")  // the Shape will automatically surround the TextBlock
            .add(  // add a Shape and a TextBlock to this "Auto" Panel
                new go.Shape("Circle",
                    { strokeWidth: 0, fill: "white" })  // no border; default fill is white
                    // Shape.fill is bound to Node.data.color
                    .bind("fill", "color"),
                new go.TextBlock({ margin: 5, stroke: "#333" })  // some room around the text
                    // TextBlock.text is bound to Node.data.key
                    .bind("text", "key"));

    // but use the default Link template, by not setting Diagram.linkTemplate
    myDiagram.linkTemplate =
        new go.Link("Bezier", { curviness: -20 })
            // .bind("key", "key")
            .add(new go.Shape(),
                new go.Shape({ toArrow: "Standard" }),
                new go.TextBlock({ segmentOffset: new go.Point(0, -15), background: "white" })
                    .bind("text", "label"));

    myDiagram.linkKeyProperty = "key";

    // create the model data that will be represented by Nodes and Links
    myDiagram.model = new go.GraphLinksModel(
        graphs,
        links
    );

    myDiagram.model.isReadOnly = true;


    return myDiagram;
}

