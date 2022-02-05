/**
 * Method to generate an interactive GoJS diagram automatically
 * 
 * @param {*} graphs 
 * @param {*} links 
 */
function initDiagram(graphs, links) {

    const myDiagram =
        new go.Diagram("myDiagramDiv",  // create a Diagram for a HTML Div element
            { "undoManager.isEnabled": true }, // enable undo & redo
        );

    // using the LayeredDigraphLayout layout
    myDiagram.layout = new go.LayeredDigraphLayout({ columnSpacing: 60, layerSpacing: 35 });

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
        new go.Link({ curve: go.Link.Bezier, curviness: 20 })
            .add(
                new go.Shape(),
                new go.Shape({ toArrow: "Standard" }),
                new go.Panel("Auto", { segmentOffset: new go.Point(0, -25) })
                    .add(
                        new go.Shape("RoundedRectangle", { fill: "white" }),
                        new go.TextBlock({ background: "white", margin: 2 }).bind("text", "label")
                    )
            )
        ;

    // enabling the key property for graph links 
    myDiagram.linkKeyProperty = "key";

    // create the model data that will be represented by Nodes and Links
    myDiagram.model = new go.GraphLinksModel(
        graphs,
        links
    );

    myDiagram.model.isReadOnly = true;
    // return myDiagram;
}
