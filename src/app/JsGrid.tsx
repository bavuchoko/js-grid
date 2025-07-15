import React, {memo, useCallback, useEffect, useRef, useState} from "react";
//@ts-ignore
import {VariableSizeGrid as Grid} from "react-window";
//@ts-ignore
import {useColumnWidths} from "./hook/useColumnWidths";
//@ts-ignore
import {useColumnOrder} from "./hook/useColumnOrder";
import {useCellEditing} from "./hook/useCellEditing"
import {ReactableTableProps} from "./type/types";


const defaultColumnWidth = 100;
const rowHeight = 26;


const JsGrid: React.FC<ReactableTableProps> = ({ data, customStyle, debug }) => {
    const { header, content } = data;
    const gridRef = useRef<Grid>(null);
    const { columnWidths, handleMouseDown } = useColumnWidths(data.header.length, defaultColumnWidth, gridRef);
    const { columnOrder, handleDragStart, handleDragOver, handleDrop } = useColumnOrder(data.header.length);
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    const {
        editingCell,
        inputRef,
        handleCellClick,
        handleBlur,
        handleInputChange,
    } = useCellEditing(content, header, columnOrder, columnWidths, gridRef);

    useEffect(() => {

        const handleResize = () => {
            if (containerRef.current) {
                if(debug){
                    console.log(containerRef.current.offsetWidth);
                    console.log(containerRef.current.offsetHeight);
                }
                setViewportWidth(containerRef.current.offsetWidth);
                setViewportHeight(containerRef.current.offsetHeight);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getColumnWidth = useCallback((index: number) => columnWidths[index], [columnWidths]);


    const Cell = memo(({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
        const actualColumnIndex = columnOrder[columnIndex];
        const left = columnOrder.slice(0, columnIndex).reduce((acc, cur) => acc + columnWidths[cur], 0);
        const columnKey = header[actualColumnIndex].id;

        if (rowIndex === 0) {
            return (
                <div
                    style={{
                        left,
                        width: columnWidths[actualColumnIndex],
                        border: "1px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        position: "absolute",
                        top: 0,
                        ...customStyle?.headerStyle,
                    }}
                >
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, columnIndex)}
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={(e) => handleDrop(e, columnIndex)}
                        style={{ padding: "4px" }}
                    >
                        {header[actualColumnIndex].title}
                    </div>
                    <div
                        onMouseDown={(e) => handleMouseDown(e, columnOrder[columnIndex])}
                        style={{
                            width: "5px",
                            height: "100%",
                            cursor: "col-resize",
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <div
                            style={{
                                borderLeft: "1px solid transparent",
                                marginLeft: "auto",
                                width: "3px",
                                height: "100%",
                            }}
                        />
                    </div>
                </div>
            );
        }
        const rowIndexAdjusted = rowIndex - 1;
        const rowData = content[rowIndexAdjusted];
        const customEditor = header[actualColumnIndex].renderEditCell;
        const customRenderer = header[actualColumnIndex].renderEditCell;
        // @ts-ignore
        // @ts-ignore
        return (
            <div
                style={{
                    ...style,
                    left,
                    width: columnWidths[actualColumnIndex],
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: rowIndex % 2 === 0 ? "#f9f9f9" : "#fff",
                    cursor: "pointer",
                }}
                onClick={() => handleCellClick(rowIndex, columnIndex)}
            >
                {editingCell.current?.row === rowIndexAdjusted && editingCell.current?.col === columnIndex ? (
                    customEditor ? (
                        customEditor({
                            value: rowData[columnKey] || "",
                            onChange: (e) =>{
                                handleInputChange(e , rowIndexAdjusted, columnIndex)
                            },
                        })

                    ) : (
                        <input
                            ref={inputRef}
                            autoFocus
                            defaultValue={rowData[columnKey] || ""}
                            onChange={(e) => handleInputChange(e, rowIndexAdjusted, columnIndex)}
                            onBlur={handleBlur}
                            onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                textAlign: "center",
                                background: "white",
                            }}
                        />
                    )
                ) : customRenderer ? (
                    customRenderer({
                        value: rowData[columnKey] || "",
                        onChange: (e) =>{
                            handleInputChange(e , rowIndexAdjusted, columnIndex)
                        }
                    })
                ) : (
                    rowData[columnKey]
                )}
            </div>
        );
    });

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden",  }}>
            <Grid
                ref={gridRef}
                columnCount={data.header.length}
                columnWidth={getColumnWidth}
                height={viewportHeight}
                rowCount={content.length + 1}
                rowHeight={() => rowHeight}
                width={viewportWidth}
                overscanColumnCount={2}
                overscanRowCount={5}
                itemData={columnWidths}
            >
                {Cell}
            </Grid>
        </div>
    );
};

export default JsGrid;
