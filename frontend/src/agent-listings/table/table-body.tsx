import { Agent } from "../shared/types";
import { Tr, Td, MonoText, ListingCount } from "./agent-listings-table.component";

interface TableBodyProps {
  agents: Agent[];
}

export const TableBody = ({ agents }: TableBodyProps) => (
  console.log(agents),

  <tbody>
    {agents.map((agent, index) => (
      <Tr key={`${agent.ID}-${index}`}>
        <Td style={{ textAlign: 'center', color: '#6b7280' }}>{index + 1}</Td>
        <Td>
          <MonoText>{agent.ID}</MonoText>
        </Td>
        <Td style={{fontWeight: 500}}>{agent.Name?.trim() || agent.Name}</Td>
        <Td>
          <ListingCount>{agent.ListingCount} listings</ListingCount>
        </Td>
        <Td>
          <ListingCount>
            ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(agent.AveragePrice)}
          </ListingCount>
        </Td>
      </Tr>
    ))}
  </tbody>
); 