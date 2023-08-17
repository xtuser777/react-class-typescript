import React from 'react';
import { useParams } from 'react-router-dom';
import { SalesBudgetComponent } from './component';

export function SalesBudget() {
  return <SalesBudgetComponent params={useParams()} />;
}
