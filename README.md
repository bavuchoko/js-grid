# ReactableTable

React용으로 커스터마이징 가능하고 크기 조정 및 이동이 가능한 테이블 컴포넌트입니다.

## 📌 Props

### `ReactableTableProps`

```typescript
interface ReactableTableProps {
    data: {
        header: HeaderData[];
        content: ContentData[];
    };
    customStyle?: {
        headerStyle?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
    };
    resizable?: boolean;
    movable?: boolean;
}
```

| Prop           | Type                                         | Required | Description |
|---------------|--------------------------------------------|----------|-------------|
| `data`        | `{ header: HeaderData[]; content: ContentData[]; }` | ✅ | 테이블 데이터 (헤더와 내용 포함). |
| `customStyle` | `{ headerStyle?: React.CSSProperties; contentStyle?: React.CSSProperties; }` | ❌ | 헤더와 내용에 대한 커스터마이즈 스타일. |
| `resizable`   | `boolean`                                   | ❌ | 열 크기 조정 가능 여부. 기본값: `false`. |
| `movable`     | `boolean`                                   | ❌ | 열 이동 및 재정렬 가능 여부. 기본값: `false`. |

---

## 🏷️ Data Structure

### `HeaderData`

```typescript
interface HeaderData {
    id: string;
    title: string;
    renderEditCell?: FC<{
        value: string;
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }>;
}
```

| Property        | Type    | Required | Description |
|---------------|--------|----------|-------------|
| `id`         | `string` | ✅ | 열의 고유 식별자. |
| `title`      | `string` | ✅ | 테이블 헤더에 표시될 열 제목. |
| `renderEditCell` | `FC<{ value: string; onChange: (event: ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => void; rowIndex: number; columnIndex: number; }>` | ❌ | 수정 가능한 셀을 렌더링하는 커스텀 컴포넌트. |

#### 🔹 `renderEditCell` 사용 예시

```tsx
const MyEditCell: FC<{ 
  value: string; 
  onChange: (event: ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => void;
}> = ({ value, onChange}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e)}
  />
);
```

---

### `ContentData`

```typescript
interface ContentData {
    [key: string]: string;
}
```

테이블의 각 행은 객체로 표현되며, 객체의 키는 HeaderData.id와 일치합니다.

#### 🔹  예시 콘텐츠 데이터:

```json
[
  { "name": "Alice", "age": "25" },
  { "name": "Bob", "age": "30" }
]
```

---

## 🛠️ 사용예시

```tsx
const tableData = {
  header: [
    { id: "name", title: "Name" },
    { id: "age", title: "Age" }
  ],
  content: [
    { name: "Alice", age: "25" },
    { name: "Bob", age: "30" }
  ]
};

<ReactableTable data={tableData} resizable={true} movable={true} />;
```
