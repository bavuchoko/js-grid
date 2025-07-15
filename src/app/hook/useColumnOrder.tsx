import { useState, useRef } from "react";

export const useColumnOrder = (columnCount: number) => {
    const [columnOrder, setColumnOrder] = useState<number[]>(Array.from({ length: columnCount }, (_, index) => index));
    const dragStartIndex = useRef<number | null>(null);

    const moveColumn = (fromIndex: number, toIndex: number) => {
        setColumnOrder((prevOrder) => {
            if (fromIndex === -1 || toIndex === -1) return prevOrder; // 유효하지 않은 경우 무시

            const newOrder = [...prevOrder];
            const [removed] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, removed);
            // console.log(newOrder)
            return newOrder;
        });
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        dragStartIndex.current = index;
        event.dataTransfer.setData("text/plain", String(index));
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // drop 가능하도록 설정
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        event.preventDefault();
        if (dragStartIndex.current === null) return;

        const fromIndex = dragStartIndex.current; // 원래 위치 (columnOrder의 index가 아닌, 직접 columnIndex 사용)
        const toIndex = dropIndex; // 이동하려는 대상 위치

        console.log("From Index:", fromIndex);
        console.log("To Index:", toIndex);
        console.log("Before Move:", columnOrder);

        moveColumn(fromIndex, toIndex);

        console.log("After Move:", columnOrder);
        dragStartIndex.current = null;
    };


    return { columnOrder, setColumnOrder, handleDragStart, handleDragOver, handleDrop };
};
