import { useState, useRef } from "react";
//@ts-ignore
import { Grid } from "react-window";

type ColumnWidths = number[];

export const useColumnWidths = (columnCount: number, defaultColumnWidth: number, gridRef: React.RefObject<Grid>) => {
    const [columnWidths, setColumnWidths] = useState<ColumnWidths>(
        new Array(columnCount).fill(defaultColumnWidth)
    );

    const resizingColumn = useRef<number | null>(null);
    const startX = useRef<number>(0);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, colIndex: number) => {
        startX.current = event.clientX;
        resizingColumn.current = colIndex;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (resizingColumn.current === null) return;
        const deltaX = event.clientX - startX.current;
        const columnIndex = resizingColumn.current;

        setColumnWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths[columnIndex] = Math.max(50, prevWidths[columnIndex] + deltaX);
            return newWidths;
        });
        startX.current = event.clientX;
        gridRef.current?.resetAfterColumnIndex(columnIndex, false);
    };

    const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return { columnWidths, setColumnWidths, handleMouseDown };
};
