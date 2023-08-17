import React, { ChangeEvent, ReactNode } from 'react';
import { Col, FormGroup, Label, Input, Badge } from 'reactstrap';

interface IProps {
  colSm: number;
  label: string;
  id: string;
  obrigatory: boolean;
  readonly?: boolean;
  disable?: boolean;
  children?: ReactNode;
  value?: string;
  message?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function FormInputSelect(props: IProps): JSX.Element {
  return (
    <Col sm={`${props.colSm}`}>
      <FormGroup>
        <Label for={`${props.id}`}>
          {props.label}
          {props.obrigatory ? <span style={{ color: 'red' }}>*</span> : ''}:
        </Label>
        <Input
          type="select"
          id={`${props.id}`}
          bsSize="sm"
          style={{ width: '100%' }}
          value={props.value}
          disabled={props.disable}
          onChange={(e) => props.onChange(e)}
          readOnly={props.readonly ? true : false}
        >
          {props.children}
        </Input>
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
