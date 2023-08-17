import React from 'react';
import { Link } from 'react-router-dom';
import { Col, FormGroup, Label, Button } from 'reactstrap';

interface IProps {
  colSm: number;
  id: string;
  color: string;
  text: string;
  to: string;
}

export function FormButtonLink(props: IProps): JSX.Element {
  return (
    <Col sm={`${props.colSm}`}>
      <FormGroup>
        <Label for={`${props.id}`}>&nbsp;</Label>
        <Link to={props.to}>
          <Button
            id={`${props.id}`}
            size="sm"
            style={{ width: '100%' }}
            color={props.color}
          >
            {props.text}
          </Button>
        </Link>
      </FormGroup>
    </Col>
  );
}
