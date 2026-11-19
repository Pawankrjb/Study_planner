import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Whiteboard() {
  const canvasRef = useRef(null);

  const isDrawing = useRef(false);
  const startPoint = useRef(null);
  const snapshot = useRef(null);

  const history = useRef([]);
  const historyIndex = useRef(-1);

  const navigate = useNavigate();

  const [tool, setTool] = useState("hand");
  const [stroke, setStroke] = useState("#1e1e1e");
  const [background, setBackground] = useState("#ffffff");

  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState("solid");

  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);

  const [canvasHeight, setCanvasHeight] = useState(1100);
  const [showProperties, setShowProperties] = useState(true);
  const [textEditor, setTextEditor] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [texts, setTexts] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [shapeDraft, setShapeDraft] = useState(null);
  const textInputRef = useRef(null);
  const workspaceRef = useRef(null);
  const panStart = useRef(null);
  const draggingText = useRef(null);
  const draggingShape = useRef(null);
  const nextTextId = useRef(1);
  const nextShapeId = useRef(1);

  useEffect(() => {
    if (textEditor && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textEditor]);

  const strokeColors = [
    "#1e1e1e",
    "#e03131",
    "#2f9e44",
    "#1971c2",
    "#f08c00",
  ];

  const backgroundColors = [
    "#ffffff",
    "#ffc9c9",
    "#b2f2bb",
    "#a5d8ff",
    "#ffec99",
  ];

  // Toolbar tools
  const tools = [
    { id: "hand", icon: "✋", name: "Hand" },
    { id: "select", icon: "↖", name: "Select" },
    { id: "rectangle", icon: "▢", name: "Rectangle" },
    { id: "diamond", icon: "◇", name: "Diamond" },
    { id: "ellipse", icon: "◯", name: "Circle" },
    { id: "arrow", icon: "➜", name: "Arrow" },
    { id: "line", icon: "／", name: "Line" },
    { id: "pen", icon: "✎", name: "Draw" },
    { id: "text", icon: "T", name: "Text" },
    { id: "eraser", icon: "▱", name: "Eraser" },
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvasHeight * dpr;

    const ctx = canvas.getContext("2d");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.clientWidth, canvasHeight);

    saveHistory();
  }, []);

  // Save History
  const saveHistory = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const image = canvas.toDataURL("image/png");

    history.current = history.current.slice(
      0,
      historyIndex.current + 1
    );

    history.current.push(image);

    if (history.current.length > 40) {
      history.current.shift();
    }

    historyIndex.current = history.current.length - 1;
  };

  // Get Mouse Position
  const getPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Apply Drawing Style
  const applyStyle = (ctx) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (strokeStyle === "dashed") {
      ctx.setLineDash([8, 6]);
    } else if (strokeStyle === "dotted") {
      ctx.setLineDash([2, 6]);
    } else {
      ctx.setLineDash([]);
    }
  };

const addText = (point) => {
  setTextEditor({ ...point, id: null });
  setTextValue("");
};

const saveText = () => {
  if (!textEditor) return;

  const value = textValue.trim();

  if (value) {
    const text = {
      id: textEditor.id || nextTextId.current++,
      x: textEditor.x,
      y: textEditor.y,
      value,
      color: textEditor.id
        ? texts.find((item) => item.id === textEditor.id)?.color || stroke
        : stroke,
      fontFamily: textEditor.id
        ? texts.find((item) => item.id === textEditor.id)?.fontFamily || fontFamily
        : fontFamily,
      fontSize: textEditor.id
        ? texts.find((item) => item.id === textEditor.id)?.fontSize || fontSize
        : fontSize,
    };

    setTexts((current) =>
      textEditor.id
        ? current.map((item) => (item.id === text.id ? text : item))
        : [...current, text]
    );
    setSelectedTextId(text.id);
  } else if (textEditor.id) {
    setTexts((current) => current.filter((item) => item.id !== textEditor.id));
    setSelectedTextId(null);
  }

  setTextEditor(null);
  setTextValue("");
};

const editText = (text) => {
  setSelectedTextId(text.id);
  setTextEditor(text);
  setTextValue(text.value);
};

const handleTextPointerDown = (e, text) => {
  e.stopPropagation();
  setSelectedTextId(text.id);

  if (e.detail > 1) {
    editText(text);
    return;
  }

  draggingText.current = {
    id: text.id,
    offsetX: e.clientX - canvasRef.current.getBoundingClientRect().left - text.x,
    offsetY: e.clientY - canvasRef.current.getBoundingClientRect().top - text.y,
  };
  e.currentTarget.setPointerCapture(e.pointerId);
};

const handleTextPointerMove = (e) => {
  const drag = draggingText.current;
  if (!drag) return;

  const rect = canvasRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left - drag.offsetX;
  const y = e.clientY - rect.top - drag.offsetY;

  setTexts((current) =>
    current.map((item) =>
      item.id === drag.id
        ? { ...item, x: Math.max(0, x), y: Math.max(0, y) }
        : item
    )
  );
};

const stopTextDragging = () => {
  draggingText.current = null;
};

  const normalizeShape = (start, end, type, id) => ({
    id,
    type,
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
    startX: start.x <= end.x ? 0 : 1,
    startY: start.y <= end.y ? 0 : 1,
    color: stroke,
    strokeWidth,
    strokeStyle,
  });

  const shapeStyle = (shape) => ({
    fill: "transparent",
    stroke: shape.color,
    strokeWidth: shape.strokeWidth,
    strokeDasharray:
      shape.strokeStyle === "dashed"
        ? "8 6"
        : shape.strokeStyle === "dotted"
        ? "2 6"
        : undefined,
  });

  const handleShapePointerDown = (e, shape) => {
    if (tool !== "select") return;
    e.stopPropagation();
    setSelectedShapeId(shape.id);
    setSelectedTextId(null);
    const point = getPosition(e);
    draggingShape.current = {
      id: shape.id,
      mode: "move",
      offsetX: point.x - shape.x,
      offsetY: point.y - shape.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleShapeMove = (e) => {
    const drag = draggingShape.current;
    if (!drag) return;
    const point = getPosition(e);

    setShapes((current) =>
      current.map((shape) => {
        if (shape.id !== drag.id) return shape;
        if (drag.mode === "resize") {
          const width = Math.max(12, point.x - shape.x);
          const height = Math.max(12, point.y - shape.y);
          return { ...shape, width, height };
        }
        return {
          ...shape,
          x: Math.max(0, point.x - drag.offsetX),
          y: Math.max(0, point.y - drag.offsetY),
        };
      })
    );
  };

  const startShapeResize = (e, shape) => {
    e.stopPropagation();
    setSelectedShapeId(shape.id);
    const point = getPosition(e);
    draggingShape.current = {
      id: shape.id,
      mode: "resize",
      offsetX: point.x,
      offsetY: point.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const stopShapeDragging = () => {
    draggingShape.current = null;
  };

useEffect(() => {
  const handleKeyDown = (e) => {
    if ((!selectedTextId && !selectedShapeId) || textEditor) return;
    if (e.key !== "Delete" && e.key !== "Backspace") return;

    e.preventDefault();
    if (selectedTextId) {
      setTexts((current) => current.filter((text) => text.id !== selectedTextId));
      setSelectedTextId(null);
    }
    if (selectedShapeId) {
      setShapes((current) => current.filter((shape) => shape.id !== selectedShapeId));
      setSelectedShapeId(null);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [selectedTextId, selectedShapeId, textEditor]);

  // Start Drawing
  const startDrawing = (e) => {
    if (tool === "hand") return;

    if (tool === "select") {
      setSelectedTextId(null);
      setSelectedShapeId(null);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const point = getPosition(e);

    if (tool === "text") {
      if (textEditor) saveText();
      addText(point);
      return;
    }

    if (["rectangle", "diamond", "ellipse", "line", "arrow"].includes(tool)) {
      canvas.setPointerCapture(e.pointerId);
      isDrawing.current = true;
      startPoint.current = point;
      setShapeDraft({ start: point, end: point, type: tool });
      return;
    }

    canvas.setPointerCapture(e.pointerId);

    isDrawing.current = true;

    startPoint.current = point;

    snapshot.current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();

      ctx.moveTo(point.x, point.y);

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = Math.max(12, strokeWidth * 5);
      } else {
        applyStyle(ctx);
      }
    }
  };

  // Drawing
  // Drawing
const draw = (e) => {

  // HAND TOOL - Move Whiteboard
  if (tool === "hand" && panStart.current) {

    workspaceRef.current.scrollLeft =
      panStart.current.scrollLeft -
      (e.clientX - panStart.current.x);

    workspaceRef.current.scrollTop =
      panStart.current.scrollTop -
      (e.clientY - panStart.current.y);

    return;
  }

  if (!isDrawing.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const point = getPosition(e);

  if (["rectangle", "diamond", "ellipse", "line", "arrow"].includes(tool)) {
    setShapeDraft((current) => current && { ...current, end: point });
    return;
  }

  // PEN
  if (tool === "pen") {

    ctx.lineTo(point.x, point.y);
    ctx.stroke();

  }

  // ERASER
  else if (tool === "eraser") {

    ctx.lineTo(point.x, point.y);
    ctx.stroke();

  }

};

  // Stop Drawing
  const stopDrawing = (e) => {
    if (!isDrawing.current) return;

    isDrawing.current = false;

    const ctx = canvasRef.current.getContext("2d");

    ctx.globalCompositeOperation = "source-over";

    ctx.setLineDash([]);

    ctx.closePath();

    snapshot.current = null;

    if (shapeDraft) {
      const shape = normalizeShape(
        shapeDraft.start,
        shapeDraft.end,
        shapeDraft.type,
        nextShapeId.current++
      );
      if (shape.width > 4 || shape.height > 4) {
        setShapes((current) => [...current, shape]);
      }
      setShapeDraft(null);
    }

    if (
      canvasRef.current.hasPointerCapture(e.pointerId)
    ) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }

    saveHistory();
  };

  // Restore Canvas
  const restoreCanvas = (imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const dpr = window.devicePixelRatio || 1;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    img.src = imageData;
  };

  // Undo
  const undo = () => {
    if (historyIndex.current <= 0) return;

    historyIndex.current--;

    restoreCanvas(history.current[historyIndex.current]);
  };

  // Redo
  const redo = () => {
    if (
      historyIndex.current >= history.current.length - 1
    ) return;

    historyIndex.current++;

    restoreCanvas(history.current[historyIndex.current]);
  };

  // Clear Board
  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = background;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    setTexts([]);
    setShapes([]);
    setSelectedTextId(null);
    setSelectedShapeId(null);
    setTextEditor(null);
    setTextValue("");
    saveHistory();
  };

  // Add More Space
  const addMoreSpace = () => {
    const canvas = canvasRef.current;

    const dpr = window.devicePixelRatio || 1;

    const oldImage = document.createElement("canvas");

    oldImage.width = canvas.width;
    oldImage.height = canvas.height;

    oldImage.getContext("2d").drawImage(canvas, 0, 0);

    const newHeight = canvasHeight + 700;

    canvas.height = newHeight * dpr;

    const ctx = canvas.getContext("2d");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = background;

    ctx.fillRect(
      0,
      0,
      canvas.clientWidth,
      newHeight
    );

    ctx.drawImage(
      oldImage,
      0,
      0,
      oldImage.width / dpr,
      oldImage.height / dpr
    );

    setCanvasHeight(newHeight);

    saveHistory();
  };

  // Download
  const downloadBoard = () => {
    const canvas = canvasRef.current;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportContext = exportCanvas.getContext("2d");
    exportContext.drawImage(canvas, 0, 0);

    const dpr = window.devicePixelRatio || 1;
    texts.forEach((text) => {
      exportContext.save();
      exportContext.scale(dpr, dpr);
      exportContext.fillStyle = text.color;
      exportContext.font = `${text.fontSize}px ${text.fontFamily}`;
      exportContext.textBaseline = "top";
      exportContext.fillText(text.value, text.x, text.y);
      exportContext.restore();
    });

    shapes.forEach((shape) => {
      exportContext.save();
      exportContext.strokeStyle = shape.color;
      exportContext.lineWidth = shape.strokeWidth * dpr;
      exportContext.setLineDash(
        shape.strokeStyle === "dashed"
          ? [8 * dpr, 6 * dpr]
          : shape.strokeStyle === "dotted"
          ? [2 * dpr, 6 * dpr]
          : []
      );
      const x = shape.x * dpr;
      const y = shape.y * dpr;
      const width = shape.width * dpr;
      const height = shape.height * dpr;
      exportContext.beginPath();
      if (shape.type === "rectangle") {
        exportContext.roundRect(x, y, width, height, 12 * dpr);
      } else if (shape.type === "ellipse") {
        exportContext.ellipse(
          x + width / 2,
          y + height / 2,
          width / 2,
          height / 2,
          0,
          0,
          Math.PI * 2
        );
      } else if (shape.type === "diamond") {
        exportContext.moveTo(x + width / 2, y);
        exportContext.lineTo(x + width, y + height / 2);
        exportContext.lineTo(x + width / 2, y + height);
        exportContext.lineTo(x, y + height / 2);
        exportContext.closePath();
      } else {
        const startX = shape.startX ? x + width : x;
        const startY = shape.startY ? y + height : y;
        const endX = shape.startX ? x : x + width;
        const endY = shape.startY ? y : y + height;
        exportContext.moveTo(startX, startY);
        exportContext.lineTo(endX, endY);
        if (shape.type === "arrow") {
          const angle = Math.atan2(endY - startY, endX - startX);
          const head = 15 * dpr;
          exportContext.moveTo(endX, endY);
          exportContext.lineTo(
            endX - head * Math.cos(angle - Math.PI / 6),
            endY - head * Math.sin(angle - Math.PI / 6)
          );
          exportContext.moveTo(endX, endY);
          exportContext.lineTo(
            endX - head * Math.cos(angle + Math.PI / 6),
            endY - head * Math.sin(angle + Math.PI / 6)
          );
        }
      }
      exportContext.stroke();
      exportContext.restore();
    });

    const link = document.createElement("a");

    link.download = "classroom-whiteboard.png";

    link.href = exportCanvas.toDataURL("image/png");

    link.click();
  };

  const visibleShapes = shapeDraft
    ? [
        ...shapes,
        normalizeShape(shapeDraft.start, shapeDraft.end, shapeDraft.type, "draft"),
      ]
    : shapes;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#f8f9fc] text-gray-800">

      {/* TOP TOOLBAR */}

      <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">

        <div className="flex items-center gap-3">

          <button
            onClick={() => setShowProperties(!showProperties)}
            className="rounded-lg bg-gray-100 px-3 py-2 text-lg hover:bg-gray-200"
          >
            ☰
          </button>

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            ← Back
          </button>

          <span className="hidden text-sm font-semibold text-gray-600 sm:inline">
            Classroom Whiteboard
          </span>

        </div>

        {/* CENTER TOOLS */}

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">

          {tools.map((item) => (

            <button
              key={item.id}
              title={item.name}
              onClick={() => setTool(item.id)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-lg transition ${
                tool === item.id
                  ? "border-violet-200 bg-violet-100 text-violet-700"
                  : "border-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
            </button>

          ))}

        </div>

        {/* RIGHT ACTIONS */}

        <div className="flex items-center gap-2">

          <button
            onClick={undo}
            title="Undo"
            className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100"
          >
            ↶
          </button>

          <button
            onClick={redo}
            title="Redo"
            className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100"
          >
            ↷
          </button>

          <button
            onClick={clearBoard}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Clear
          </button>

          <button
            onClick={downloadBoard}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Export
          </button>

        </div>

      </header>

      {/* MAIN WORKSPACE */}

      <main className="relative flex min-h-0 flex-1 overflow-hidden">

        {/* LEFT PROPERTIES PANEL */}

        {showProperties && (

          <aside className="z-10 m-3 w-48 shrink-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-md">

            <h2 className="mb-4 text-sm font-semibold">
              Properties
            </h2>

            {/* STROKE */}

            <section className="mb-5">

              <p className="mb-2 text-xs font-medium text-gray-600">
                Stroke
              </p>

              <div className="flex flex-wrap gap-2">

                {strokeColors.map((c) => (

                  <button
                    key={c}
                    onClick={() => setStroke(c)}
                    style={{ backgroundColor: c }}
                    className={`h-6 w-6 rounded-md border ${
                      stroke === c
                        ? "ring-2 ring-violet-300 ring-offset-1"
                        : "border-gray-200"
                    }`}
                  />

                ))}

                <input
                  type="color"
                  value={stroke}
                  onChange={(e) => setStroke(e.target.value)}
                  className="h-7 w-7 cursor-pointer"
                />

              </div>

            </section>

            {/* BACKGROUND */}

            <section className="mb-5">

              <p className="mb-2 text-xs font-medium text-gray-600">
                Background
              </p>

              <div className="flex flex-wrap gap-2">

                {backgroundColors.map((c) => (

                  <button
                    key={c}
                    onClick={() => setBackground(c)}
                    style={{ backgroundColor: c }}
                    className={`h-6 w-6 rounded-md border ${
                      background === c
                        ? "ring-2 ring-violet-300 ring-offset-1"
                        : "border-gray-200"
                    }`}
                  />

                ))}

                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-7 w-7 cursor-pointer"
                />

              </div>

              <p className="mt-2 text-[11px] text-gray-400">
                Background applies when clearing the board.
              </p>

            </section>

            {/* STROKE WIDTH */}

            <section className="mb-5">

              <div className="mb-2 flex justify-between text-xs">

                <span className="font-medium text-gray-600">
                  Stroke width
                </span>

                <span>{strokeWidth}px</span>

              </div>

              <input
                type="range"
                min="1"
                max="12"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-violet-600"
              />

            </section>

            {/* STROKE STYLE */}

            <section className="mb-5">

              <p className="mb-2 text-xs font-medium text-gray-600">
                Stroke style
              </p>

              <div className="flex gap-2">

                {["solid", "dashed", "dotted"].map((style) => (

                  <button
                    key={style}
                    onClick={() => setStrokeStyle(style)}
                    className={`rounded-lg px-2 py-2 text-xs ${
                      strokeStyle === style
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {style === "solid"
                      ? "━━"
                      : style === "dashed"
                      ? "- - -"
                      : "····"}
                  </button>

                ))}

              </div>

            </section>

            {/* FONT FAMILY */}

            <section className="mb-5">

              <p className="mb-2 text-xs font-medium text-gray-600">
                Font family
              </p>

              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs"
              >

                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Handwritten</option>

              </select>

            </section>

            {/* FONT SIZE */}

            <section className="mb-5">

              <div className="mb-2 flex justify-between text-xs">

                <span className="font-medium text-gray-600">
                  Font size
                </span>

                <span>{fontSize}px</span>

              </div>

              <input
                type="range"
                min="12"
                max="64"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-violet-600"
              />

            </section>

            <p className="text-[11px] leading-5 text-gray-400">
              Select Text tool and click anywhere on the board to add text.
            </p>

          </aside>

        )}

        {/* WHITEBOARD AREA */}

        <section className="min-w-0 flex-1 overflow-auto bg-[#f3f4f6] p-5 md:p-8">

          <div
             className="relative mx-auto w-full bg-white shadow-sm"
            style={{ minHeight: canvasHeight }}
          >

            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              style={{
                height: `${canvasHeight}px`,
                touchAction: "none",
                background: background,
              }}
              className={`block w-full ${
                tool === "hand"
                  ? "cursor-grab"
                  : tool === "text"
                  ? "cursor-text"
                  : "cursor-crosshair"
              }`}
            />
            <svg
              aria-label="Whiteboard shapes"
              width="100%"
              height={canvasHeight}
              style={{
                position: "absolute",
                inset: 0,
                overflow: "visible",
                pointerEvents: tool === "select" ? "auto" : "none",
                zIndex: 4,
              }}
            >
              {visibleShapes.map((shape) => {
                const selected = selectedShapeId === shape.id;
                const commonProps = {
                  ...shapeStyle(shape),
                  onPointerDown: (e) => handleShapePointerDown(e, shape),
                  onPointerMove: handleShapeMove,
                  onPointerUp: stopShapeDragging,
                  onPointerCancel: stopShapeDragging,
                  style: { cursor: tool === "select" ? "move" : "default" },
                };
                let element;

                if (shape.type === "rectangle") {
                  element = (
                    <rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      rx="12"
                      {...commonProps}
                    />
                  );
                } else if (shape.type === "ellipse") {
                  element = (
                    <ellipse
                      cx={shape.x + shape.width / 2}
                      cy={shape.y + shape.height / 2}
                      rx={shape.width / 2}
                      ry={shape.height / 2}
                      {...commonProps}
                    />
                  );
                } else if (shape.type === "diamond") {
                  element = (
                    <polygon
                      points={`${shape.x + shape.width / 2},${shape.y} ${
                        shape.x + shape.width
                      },${shape.y + shape.height / 2} ${
                        shape.x + shape.width / 2
                      },${shape.y + shape.height} ${shape.x},${
                        shape.y + shape.height / 2
                      }`}
                      {...commonProps}
                    />
                  );
                } else {
                  const startX = shape.startX ? shape.x + shape.width : shape.x;
                  const startY = shape.startY ? shape.y + shape.height : shape.y;
                  const endX = shape.startX ? shape.x : shape.x + shape.width;
                  const endY = shape.startY ? shape.y : shape.y + shape.height;
                  element = (
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      markerEnd={shape.type === "arrow" ? "url(#arrowhead)" : undefined}
                      {...commonProps}
                    />
                  );
                }

                return (
                  <React.Fragment key={shape.id}>
                    {element}
                    {selected && (
                      <>
                        <rect
                          x={shape.x - 4}
                          y={shape.y - 4}
                          width={shape.width + 8}
                          height={shape.height + 8}
                          fill="none"
                          stroke="#7c3aed"
                          strokeDasharray="5 4"
                          pointerEvents="none"
                        />
                        <rect
                          x={shape.x + shape.width - 6}
                          y={shape.y + shape.height - 6}
                          width="12"
                          height="12"
                          fill="white"
                          stroke="#7c3aed"
                          onPointerDown={(e) => startShapeResize(e, shape)}
                          onPointerMove={handleShapeMove}
                          onPointerUp={stopShapeDragging}
                          onPointerCancel={stopShapeDragging}
                          style={{ cursor: "nwse-resize" }}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
            </svg>
            {texts.map((text) => (
              <div
                key={text.id}
                onPointerDown={(e) => handleTextPointerDown(e, text)}
                onPointerMove={handleTextPointerMove}
                onPointerUp={stopTextDragging}
                onPointerCancel={stopTextDragging}
                style={{
                  position: "absolute",
                  left: text.x,
                  top: text.y,
                  color: text.color,
                  fontSize: `${text.fontSize}px`,
                  fontFamily: text.fontFamily,
                  lineHeight: 1.2,
                  whiteSpace: "pre",
                  cursor: "move",
                  userSelect: "none",
                  zIndex: 5,
                }}
                className={
                  selectedTextId === text.id
                    ? "rounded border border-dashed border-violet-500 px-1"
                    : "px-1"
                }
              >
                {text.value}
              </div>
            ))}

            {textEditor && (
              <input
                ref={textInputRef}
                autoFocus
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveText();
                  }

                  if (e.key === "Escape") {
                    setTextEditor(null);
                    setTextValue("");
                  }
                }}
                placeholder="Type something..."
                style={{
                  position: "absolute",
                  left: textEditor.x,
                  top: textEditor.y,
                  fontSize: `${textEditor.fontSize || fontSize}px`,
                  fontFamily: textEditor.fontFamily || fontFamily,
                  color: textEditor.color || stroke,
                  minWidth: "150px",
                  zIndex: 10,
                  pointerEvents: "auto",
                }}
                className="border-0 bg-transparent outline-none shadow-none focus:ring-0"
              />
            )}
          </div>

          {/* ADD MORE SPACE */}

          <div className="flex justify-center py-5">

            <button
              onClick={addMoreSpace}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              + Add More Whiteboard Space
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Whiteboard;