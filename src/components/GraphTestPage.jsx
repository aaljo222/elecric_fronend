import CytoscapeComponent from "react-cytoscapejs";

export default function GraphTestPage() {
  const elements = [
    // ===== Nodes =====
    {
      data: { id: "MC-01", label: "자기회로" },
      position: { x: 0, y: 0 },
    },
    {
      data: { id: "C-flux", label: "자속" },
      position: { x: 300, y: -100 },
    },
    {
      data: { id: "C-field", label: "자기장" },
      position: { x: 300, y: 100 },
    },

    // ===== Edges =====
    {
      data: {
        id: "e1",
        source: "MC-01",
        target: "C-flux",
        label: "HAS_CONCEPT",
      },
    },
    {
      data: {
        id: "e2",
        source: "MC-01",
        target: "C-field",
        label: "HAS_CONCEPT",
      },
    },
  ];

  return (
    <div className="w-screen h-screen bg-gray-100">
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        layout={{ name: "preset" }} // 좌표 그대로
        zoomingEnabled
        userZoomingEnabled
        panningEnabled
        userPanningEnabled
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#2563eb",
              color: "#fff",
              width: 80,
              height: 80,
              "font-size": 14,
            },
          },
          {
            selector: "edge",
            style: {
              label: "data(label)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "line-color": "#64748b",
              "target-arrow-color": "#64748b",
              "font-size": 10,
            },
          },
        ]}
      />
    </div>
  );
}
