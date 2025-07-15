import React from 'react';
import './App.css';
import ReactableTable from "./app/ReactableTable";
import {ContentData, HeaderData} from "./app/type/types";


function App() {

  const columnCount = 100;
  const rowCount = 2000;

  const DateEditor: React.FC<{
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ value, onChange}) => {
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event);  // 추가 인자 전달
    };

    return (
        <input
            type="date"
            value={value}
            onChange={handleDateChange}  // handleDateChange를 onChange로 사용
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              textAlign: "center",
              background: "white",
            }}
        />
    );
  };





  const headerData:HeaderData[] = Array.from({ length: columnCount }, (_, index) => ({
    id: `column_${index}`,
    title: `Column ${index + 1}`,
    renderEditCell: index === 2 ? DateEditor : undefined,

  }));

// 2000개의 행 생성
  const contentData: ContentData[] = Array.from({ length: rowCount }, (_, rowIndex) => {
    const row: { [key: string]: string } = {};
    headerData.forEach((col, colIndex) => {
      row[col.id] = ` ${rowIndex + 1} 행 ${colIndex + 1} 열`;
    });
    return row;
  });
  const data = { header: headerData, content: contentData };

  const customTableStyle = {
    headerStyle: {
      background: "green",
      color: "white",
    },
  };

  let vh = window.innerHeight * 0.01

  document.documentElement.style.setProperty('--vh', `${vh}px`)

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })


  return (
      <div className="App">
        <div
            style={{
              width: "100%",
              height: "calc(100 * var(--vh))",
              overflow: "auto",
            }}
        >
          <ReactableTable
              data={data}
              customStyle={customTableStyle}
          />
          {/*<ReactableTable />*/}
        </div>
      </div>
  );
}

export default App;
