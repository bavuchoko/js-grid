import React, {ChangeEvent, FC} from "react";

export interface HeaderData {
    id: string;
    title: string;
    renderEditCell?: FC<{
        value: string;
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }>;
}

export interface ContentData {
    [key: string]: string;
}

export interface ReactableTableProps {
    data: {
        header: HeaderData[];
        content: ContentData[];
    };
    customStyle?: {
        headerStyle?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
    };
    debug?:boolean;
}