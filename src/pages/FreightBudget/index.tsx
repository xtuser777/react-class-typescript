import { useParams } from 'react-router-dom';
import { FreightBudgetComponent } from './component';

export function FreightBudget() {
  return <FreightBudgetComponent params={useParams()} />;
}
