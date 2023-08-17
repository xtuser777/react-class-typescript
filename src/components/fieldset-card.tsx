import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  legend: string;
  obrigatoryFields?: boolean;
}

export function FieldsetCard(props: Props): JSX.Element {
  return (
    <div className="fieldset-card">
      <div className="fieldset-card-legend">{props.legend}</div>
      <div className="fieldset-card-container">
        {props.children}
        {props.obrigatoryFields ? (
          <div className="fieldset-card-legend-obg">
            * Campos de preenchimento obrigatório.
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
