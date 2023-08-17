import React, { ChangeEvent, ReactNode } from 'react';
import {
  Col,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Badge,
} from 'reactstrap';

interface IProps {
  colSm: number;
  label: string;
  id: string;
  groupText: ReactNode;
  obrigatory: boolean;
  readonly?: boolean;
  value?: string;
  message?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function FormInputGroupEmail(props: IProps): JSX.Element {
  return (
    <Col sm={`${props.colSm}`}>
      <FormGroup>
        <Label for={`${props.id}`}>
          {props.label}
          {props.obrigatory ? <span style={{ color: 'red' }}>*</span> : ''}:
        </Label>
        <InputGroup style={{ width: '100%' }}>
          <InputGroupText>{props.groupText}</InputGroupText>
          <Input
            type="email"
            id={`${props.id}`}
            bsSize="sm"
            value={props.value}
            onChange={(e) => props.onChange(e)}
            readOnly={props.readonly ? true : false}
          />
        </InputGroup>
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
