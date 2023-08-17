import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';

interface IProp {
  clear: boolean;
  save: boolean;
  backLink: string;
  clearFields?: () => void;
  persistData?: () => Promise<void>;
}

export function FormButtonsSave(props: IProp): JSX.Element {
  return (
    <Row>
      <Col sm="2">
        <Link to={props.backLink}>
          <Button color="secondary" id="voltar" size="sm" style={{ width: '100%' }}>
            VOLTAR
          </Button>
        </Link>
      </Col>
      {props.clear ? (
        <>
          <Col sm="6"></Col>
          <Col sm="2">
            <Button
              color="primary"
              id="limpar"
              size="sm"
              style={{ width: '100%' }}
              onClick={() => {
                if (props.clearFields) props.clearFields();
              }}
            >
              LIMPAR
            </Button>
          </Col>
        </>
      ) : (
        <Col sm="8"></Col>
      )}
      {props.save ? (
        <Col sm="2">
          <Button
            color="success"
            id="salvar"
            size="sm"
            style={{ width: '100%' }}
            onClick={async () => {
              if (props.persistData) await props.persistData();
            }}
          >
            SALVAR
          </Button>
        </Col>
      ) : (
        <Col sm="2"></Col>
      )}
    </Row>
  );
}
