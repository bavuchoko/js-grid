// hooks/useCellEditing.ts
import { useState, useRef, useCallback } from "react";
import { ContentData, HeaderData } from "../type/types";

export const useCellEditing = (
    contentData: ContentData[],
    header: HeaderData[],
    columnOrder: number[],
    columnWidths: number[],
    gridRef: React.RefObject<any>
) => {
    const editingCell = useRef<{ row: number; col: number } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const contentDataRef = useRef(contentData);

    const handleCellClick = useCallback(
        (rowIndex: number, columnIndex: number) => {
            if (rowIndex === 0) return;
            editingCell.current = { row: rowIndex - 1, col: columnIndex };
            gridRef.current?.resetAfterIndices({ rowIndex, columnIndex });
        },
        [gridRef]
    );

    const handleBlur = useCallback(() => {
        editingCell.current = null;
        gridRef.current?.resetAfterIndices({ rowIndex: 0, columnIndex: 0 });
        const updatedData = contentDataRef.current;
    }, [gridRef]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
            contentDataRef.current[rowIndex][header[columnOrder[columnIndex]].id] = e.target.value.toString();
            gridRef.current?.resetAfterIndices({ rowIndex: rowIndex + 1, columnIndex });
        },
        [columnOrder, header, gridRef]
    );

    return {
        editingCell,
        inputRef,
        handleCellClick,
        handleBlur,
        handleInputChange,
    };
};
