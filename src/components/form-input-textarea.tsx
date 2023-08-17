import React, { ChangeEvent } from 'react';
import { Col, FormGroup, Label, Input, Badge } from 'reactstrap';

interface IProps {
  colSm: number;
  label: string;
  id: string;
  obrigatory: boolean;
  rows: number;
  value: string;
  message?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function FormInputTextarea(props: IProps): JSX.Element {
  return (
    <Col sm={`${props.colSm}`}>
      <FormGroup>
        <Label for={`${props.id}`}>
          {props.label}
          {props.obrigatory ? <span style={{ color: 'red' }}>*</span> : ''}:
        </Label>
        <Input
          type="textarea"
          id={`${props.id}`}
          bsSize="sm"
          rows={props.rows}
          style={{ width: '100%' }}
          value={props.value}
          onChange={(e) => props.onChange(e)}
        />
        <Badge
          id={`ms-${props.id}`}
          color="danger"
          className={props.message ? 'hidden' : ''}
        >
          {props.message ? props.message : ''}
        </Badge>
      </FormGroup>
    </Col>
  );
}
