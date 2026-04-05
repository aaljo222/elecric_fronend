import CytoscapeComponent from "react-cytoscapejs";

export default function GraphCanvas({ elements }) {
  return (
    <div className="w-screen h-screen bg-gray-50">
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        zoomingEnabled
        userZoomingEnabled
        panningEnabled
        userPanningEnabled
        layout={{
    name: "breadthfirst",
    directed: true,
    spacingFactor: 1.6,
    padding: 50,
  }}
      />
    </div>
  );
}
