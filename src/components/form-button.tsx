import React from 'react';
import { Col, FormGroup, Label, Button } from 'reactstrap';

interface IProps {
  colSm: number;
  id: string;
  color: string;
  text: string;
  onClick: () => void;
}

export function FormButton(props: IProps): JSX.Element {
  return (
    <Col sm={`${props.colSm}`}>
      <FormGroup>
        <Label for={`${props.id}`}>&nbsp;</Label>
        <Button
          id={`${props.id}`}
          size="sm"
          style={{ width: '100%' }}
          color={props.color}
          onClick={props.onClick}
        >
          {props.text}
        </Button>
      </FormGroup>
    </Col>
  );
}
