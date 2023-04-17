import React, { useMemo } from 'react';

export default (props) => {
  const data = useMemo(
    () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
    []
  );

  return (
    <div
      className="custom-tooltip border rounded p-2"
      style={{ backgroundColor: props.color || 'lightgray', }}
    >
      <p>
        <span>{data.athlete}</span>
      </p>
      <p>
        <span>Country: </span> {data.country}
      </p>
      <p>
        <span>Age: </span> {data.age}
      </p>
      <p>
        <span>Date: </span> {data.date}
      </p>
      <p>
        <span>Gold: </span> {data.gold}
      </p>
      <p>
        <span>Silver: </span> {data.silver}
      </p>
      <p>
        <span>Total: </span> {data.total}
      </p>
    </div>
  );
};