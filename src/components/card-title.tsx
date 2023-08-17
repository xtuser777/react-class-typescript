import React from 'react';

interface Props {
  text: string;
}

export function CardTitle(props: Props): JSX.Element {
  return (
    <div className="card-title">
      <div className="card-title-container" style={{ textAlign: 'center' }}>
        <h4>
          <b>SCR - {props.text}</b>
        </h4>
      </div>
    </div>
  );
}
